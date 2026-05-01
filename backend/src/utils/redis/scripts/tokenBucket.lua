-- Keys: [1] rate_limit_key
-- Args: [1] cap (max tokens), [2] rate (tokens per second), [3] now (timestamp in seconds)

local key = KEYS[1]
local cap = tonumber(ARGV[1])
local rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

-- Get the current bucket state
local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(bucket[1])
local last_refill = tonumber(bucket[2])

-- Initialize bucket if it doesn't exist
if not tokens then
    tokens = cap
    last_refill = now
else
    -- Refill tokens based on time passed
    local elapsed = math.max(0, now - last_refill)
    local refill = elapsed * rate
    tokens = math.min(cap, tokens + refill)
    last_refill = now
end

-- Check if we have enough tokens
local allowed = false
if tokens >= 1 then
    tokens = tokens - 1
    allowed = true
end

-- Save the new state
redis.call('HMSET', key, 'tokens', tokens, 'last_refill', last_refill)
-- Set expiry to avoid cluttering Redis (e.g., 1 hour)
redis.call('EXPIRE', key, 600)

return { tostring(allowed), tostring(tokens) }
