# Timezone Abbreviation Fixes

## Problem
The application was displaying both winter and summer time abbreviations (e.g., "EST/EDT" for New York) instead of showing only the current abbreviation based on whether daylight saving time is active.

## Solution
1. **Added `getCurrentTimeZoneAbbreviation` function** - Uses `Intl.DateTimeFormat` with `timeZoneName: 'short'` to get the current timezone abbreviation.

2. **Updated ClockCard component** - Now displays dynamic timezone abbreviation instead of static one.

3. **Updated popup windows** - Added JavaScript function to get current abbreviation and update it in real-time.

4. **Updated add clock dropdown** - Shows current timezone abbreviation in the search results.

5. **Updated search functionality** - Now searches both static and dynamic timezone abbreviations.

## Changes Made
- Modified the `ClockCard` component to use `getCurrentTimeZoneAbbreviation(timezone.timeZone)` instead of `timezone.abbreviation`
- Updated popup window content to include dynamic timezone abbreviation functionality
- Enhanced search filtering to include current timezone abbreviations
- Added timezone abbreviation update to popup's `updateClock` function

## Result
Now the application correctly shows:
- "EST" for New York during winter time
- "EDT" for New York during summer time
- And similar appropriate abbreviations for all other timezones based on current date/time and DST status