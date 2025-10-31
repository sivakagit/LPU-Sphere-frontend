-- Fix: Restrict profile access to authenticated users only
-- This prevents public data scraping while maintaining the MemberProfile feature

-- Remove the insecure public access policy
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;

-- Create new policy: only authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);