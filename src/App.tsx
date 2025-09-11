import React, { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Plus, Gear, X, CaretDown, CaretRight, SignOut, User as UserIcon, Download, Database, HardDrives, CloudArrowUp, ArrowSquareOut } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { UserProvider, useUser } from '@/contexts/UserContext'
import { UserAuth } from '@/components/UserAuth'

interface TimeZoneInfo {
  id: string
  city: string
  country: string
  timeZone: string
  abbreviation: string
}

interface ClockSettings {
  showAnalog: boolean
  fontFamily: string
  countryNameSize: number
  cityNameSize: number
  timeZoneSize: number
  showDigitalSeconds: boolean
  digitalDateSize: number
  digitalTimeSize: number
  showAnalogSeconds: boolean
  analogClockSize: number
  analogClockDesign: string
  analogClockColor: string
  analogNumberSize: boolean
  analogNumberFontSize: number
}

const defaultTimeZones: TimeZoneInfo[] = [
  { id: '1', city: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo', abbreviation: 'JST' },
  { id: '2', city: 'New Delhi', country: 'India', timeZone: 'Asia/Kolkata', abbreviation: 'IST' },
  { id: '3', city: 'New York', country: 'United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '4', city: 'Los Angeles', country: 'United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '5', city: 'Yangon', country: 'Myanmar', timeZone: 'Asia/Yangon', abbreviation: 'MMT' },
  { id: '6', city: 'Beijing', country: 'China', timeZone: 'Asia/Shanghai', abbreviation: 'CST' }
]

const availableTimeZones: TimeZoneInfo[] = [
  // North America
  { id: '7', city: 'New York', country: 'United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '8', city: 'Los Angeles', country: 'United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '9', city: 'Chicago', country: 'United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '10', city: 'Denver', country: 'United States', timeZone: 'America/Denver', abbreviation: 'MST/MDT' },
  { id: '11', city: 'Seattle', country: 'United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '12', city: 'Phoenix', country: 'United States', timeZone: 'America/Phoenix', abbreviation: 'MST' },
  { id: '13', city: 'Las Vegas', country: 'United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '14', city: 'Miami', country: 'United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '15', city: 'Boston', country: 'United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '16', city: 'Atlanta', country: 'United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '17', city: 'Honolulu', country: 'United States', timeZone: 'Pacific/Honolulu', abbreviation: 'HST' },
  { id: '18', city: 'Anchorage', country: 'United States', timeZone: 'America/Anchorage', abbreviation: 'AKST/AKDT' },
  { id: '19', city: 'Toronto', country: 'Canada', timeZone: 'America/Toronto', abbreviation: 'EST/EDT' },
  { id: '20', city: 'Vancouver', country: 'Canada', timeZone: 'America/Vancouver', abbreviation: 'PST/PDT' },
  { id: '21', city: 'Montreal', country: 'Canada', timeZone: 'America/Montreal', abbreviation: 'EST/EDT' },
  { id: '22', city: 'Calgary', country: 'Canada', timeZone: 'America/Edmonton', abbreviation: 'MST/MDT' },
  { id: '23', city: 'Mexico City', country: 'Mexico', timeZone: 'America/Mexico_City', abbreviation: 'CST/CDT' },
  { id: '24', city: 'Guadalajara', country: 'Mexico', timeZone: 'America/Mexico_City', abbreviation: 'CST/CDT' },

  // South America
  { id: '25', city: 'São Paulo', country: 'Brazil', timeZone: 'America/Sao_Paulo', abbreviation: 'BRT/BRST' },
  { id: '26', city: 'Rio de Janeiro', country: 'Brazil', timeZone: 'America/Sao_Paulo', abbreviation: 'BRT/BRST' },
  { id: '27', city: 'Buenos Aires', country: 'Argentina', timeZone: 'America/Argentina/Buenos_Aires', abbreviation: 'ART' },
  { id: '28', city: 'Lima', country: 'Peru', timeZone: 'America/Lima', abbreviation: 'PET' },
  { id: '29', city: 'Bogotá', country: 'Colombia', timeZone: 'America/Bogota', abbreviation: 'COT' },
  { id: '30', city: 'Santiago', country: 'Chile', timeZone: 'America/Santiago', abbreviation: 'CLT/CLST' },
  { id: '31', city: 'Caracas', country: 'Venezuela', timeZone: 'America/Caracas', abbreviation: 'VET' },

  // Europe
  { id: '32', city: 'London', country: 'United Kingdom', timeZone: 'Europe/London', abbreviation: 'GMT/BST' },
  { id: '33', city: 'Paris', country: 'France', timeZone: 'Europe/Paris', abbreviation: 'CET/CEST' },
  { id: '34', city: 'Berlin', country: 'Germany', timeZone: 'Europe/Berlin', abbreviation: 'CET/CEST' },
  { id: '35', city: 'Madrid', country: 'Spain', timeZone: 'Europe/Madrid', abbreviation: 'CET/CEST' },
  { id: '36', city: 'Rome', country: 'Italy', timeZone: 'Europe/Rome', abbreviation: 'CET/CEST' },
  { id: '37', city: 'Amsterdam', country: 'Netherlands', timeZone: 'Europe/Amsterdam', abbreviation: 'CET/CEST' },
  { id: '38', city: 'Brussels', country: 'Belgium', timeZone: 'Europe/Brussels', abbreviation: 'CET/CEST' },
  { id: '39', city: 'Vienna', country: 'Austria', timeZone: 'Europe/Vienna', abbreviation: 'CET/CEST' },
  { id: '40', city: 'Zurich', country: 'Switzerland', timeZone: 'Europe/Zurich', abbreviation: 'CET/CEST' },
  { id: '41', city: 'Stockholm', country: 'Sweden', timeZone: 'Europe/Stockholm', abbreviation: 'CET/CEST' },
  { id: '42', city: 'Oslo', country: 'Norway', timeZone: 'Europe/Oslo', abbreviation: 'CET/CEST' },
  { id: '43', city: 'Copenhagen', country: 'Denmark', timeZone: 'Europe/Copenhagen', abbreviation: 'CET/CEST' },
  { id: '44', city: 'Helsinki', country: 'Finland', timeZone: 'Europe/Helsinki', abbreviation: 'EET/EEST' },
  { id: '45', city: 'Warsaw', country: 'Poland', timeZone: 'Europe/Warsaw', abbreviation: 'CET/CEST' },
  { id: '46', city: 'Prague', country: 'Czech Republic', timeZone: 'Europe/Prague', abbreviation: 'CET/CEST' },
  { id: '47', city: 'Budapest', country: 'Hungary', timeZone: 'Europe/Budapest', abbreviation: 'CET/CEST' },
  { id: '48', city: 'Athens', country: 'Greece', timeZone: 'Europe/Athens', abbreviation: 'EET/EEST' },
  { id: '49', city: 'Istanbul', country: 'Turkey', timeZone: 'Europe/Istanbul', abbreviation: 'TRT' },
  { id: '50', city: 'Moscow', country: 'Russia', timeZone: 'Europe/Moscow', abbreviation: 'MSK' },
  { id: '51', city: 'Dublin', country: 'Ireland', timeZone: 'Europe/Dublin', abbreviation: 'GMT/IST' },
  { id: '52', city: 'Lisbon', country: 'Portugal', timeZone: 'Europe/Lisbon', abbreviation: 'WET/WEST' },

  // Asia
  { id: '53', city: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo', abbreviation: 'JST' },
  { id: '54', city: 'Beijing', country: 'China', timeZone: 'Asia/Shanghai', abbreviation: 'CST' },
  { id: '55', city: 'Shanghai', country: 'China', timeZone: 'Asia/Shanghai', abbreviation: 'CST' },
  { id: '56', city: 'Hong Kong', country: 'Hong Kong', timeZone: 'Asia/Hong_Kong', abbreviation: 'HKT' },
  { id: '57', city: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore', abbreviation: 'SGT' },
  { id: '58', city: 'Seoul', country: 'South Korea', timeZone: 'Asia/Seoul', abbreviation: 'KST' },
  { id: '59', city: 'Taipei', country: 'Taiwan', timeZone: 'Asia/Taipei', abbreviation: 'CST' },
  { id: '60', city: 'Bangkok', country: 'Thailand', timeZone: 'Asia/Bangkok', abbreviation: 'ICT' },
  { id: '61', city: 'Manila', country: 'Philippines', timeZone: 'Asia/Manila', abbreviation: 'PHT' },
  { id: '62', city: 'Kuala Lumpur', country: 'Malaysia', timeZone: 'Asia/Kuala_Lumpur', abbreviation: 'MYT' },
  { id: '63', city: 'Jakarta', country: 'Indonesia', timeZone: 'Asia/Jakarta', abbreviation: 'WIB' },
  { id: '64', city: 'Ho Chi Minh City', country: 'Vietnam', timeZone: 'Asia/Ho_Chi_Minh', abbreviation: 'ICT' },
  { id: '65', city: 'New Delhi', country: 'India', timeZone: 'Asia/Kolkata', abbreviation: 'IST' },
  { id: '66', city: 'Mumbai', country: 'India', timeZone: 'Asia/Kolkata', abbreviation: 'IST' },
  { id: '67', city: 'Bangalore', country: 'India', timeZone: 'Asia/Kolkata', abbreviation: 'IST' },
  { id: '68', city: 'Kolkata', country: 'India', timeZone: 'Asia/Kolkata', abbreviation: 'IST' },
  { id: '69', city: 'Chennai', country: 'India', timeZone: 'Asia/Kolkata', abbreviation: 'IST' },
  { id: '70', city: 'Karachi', country: 'Pakistan', timeZone: 'Asia/Karachi', abbreviation: 'PKT' },
  { id: '71', city: 'Lahore', country: 'Pakistan', timeZone: 'Asia/Karachi', abbreviation: 'PKT' },
  { id: '72', city: 'Dhaka', country: 'Bangladesh', timeZone: 'Asia/Dhaka', abbreviation: 'BST' },
  { id: '73', city: 'Colombo', country: 'Sri Lanka', timeZone: 'Asia/Colombo', abbreviation: 'SLST' },
  { id: '74', city: 'Yangon', country: 'Myanmar', timeZone: 'Asia/Yangon', abbreviation: 'MMT' },
  { id: '75', city: 'Phnom Penh', country: 'Cambodia', timeZone: 'Asia/Phnom_Penh', abbreviation: 'ICT' },
  { id: '76', city: 'Vientiane', country: 'Laos', timeZone: 'Asia/Vientiane', abbreviation: 'ICT' },
  { id: '77', city: 'Tel Aviv', country: 'Israel', timeZone: 'Asia/Jerusalem', abbreviation: 'IST/IDT' },
  { id: '78', city: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai', abbreviation: 'GST' },
  { id: '79', city: 'Riyadh', country: 'Saudi Arabia', timeZone: 'Asia/Riyadh', abbreviation: 'AST' },
  { id: '80', city: 'Kuwait City', country: 'Kuwait', timeZone: 'Asia/Kuwait', abbreviation: 'AST' },
  { id: '81', city: 'Doha', country: 'Qatar', timeZone: 'Asia/Qatar', abbreviation: 'AST' },
  { id: '82', city: 'Tehran', country: 'Iran', timeZone: 'Asia/Tehran', abbreviation: 'IRST/IRDT' },

  // Africa
  { id: '83', city: 'Cairo', country: 'Egypt', timeZone: 'Africa/Cairo', abbreviation: 'EET' },
  { id: '84', city: 'Lagos', country: 'Nigeria', timeZone: 'Africa/Lagos', abbreviation: 'WAT' },
  { id: '85', city: 'Johannesburg', country: 'South Africa', timeZone: 'Africa/Johannesburg', abbreviation: 'SAST' },
  { id: '86', city: 'Cape Town', country: 'South Africa', timeZone: 'Africa/Johannesburg', abbreviation: 'SAST' },
  { id: '87', city: 'Nairobi', country: 'Kenya', timeZone: 'Africa/Nairobi', abbreviation: 'EAT' },
  { id: '88', city: 'Addis Ababa', country: 'Ethiopia', timeZone: 'Africa/Addis_Ababa', abbreviation: 'EAT' },
  { id: '89', city: 'Casablanca', country: 'Morocco', timeZone: 'Africa/Casablanca', abbreviation: 'WET/WEST' },
  { id: '90', city: 'Tunis', country: 'Tunisia', timeZone: 'Africa/Tunis', abbreviation: 'CET' },
  { id: '91', city: 'Algiers', country: 'Algeria', timeZone: 'Africa/Algiers', abbreviation: 'CET' },
  { id: '92', city: 'Accra', country: 'Ghana', timeZone: 'Africa/Accra', abbreviation: 'GMT' },

  // Oceania
  { id: '93', city: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney', abbreviation: 'AEST/AEDT' },
  { id: '94', city: 'Melbourne', country: 'Australia', timeZone: 'Australia/Melbourne', abbreviation: 'AEST/AEDT' },
  { id: '95', city: 'Brisbane', country: 'Australia', timeZone: 'Australia/Brisbane', abbreviation: 'AEST' },
  { id: '96', city: 'Perth', country: 'Australia', timeZone: 'Australia/Perth', abbreviation: 'AWST' },
  { id: '97', city: 'Adelaide', country: 'Australia', timeZone: 'Australia/Adelaide', abbreviation: 'ACST/ACDT' },
  { id: '98', city: 'Darwin', country: 'Australia', timeZone: 'Australia/Darwin', abbreviation: 'ACST' },
  { id: '99', city: 'Auckland', country: 'New Zealand', timeZone: 'Pacific/Auckland', abbreviation: 'NZST/NZDT' },
  { id: '100', city: 'Wellington', country: 'New Zealand', timeZone: 'Pacific/Auckland', abbreviation: 'NZST/NZDT' },
  { id: '101', city: 'Suva', country: 'Fiji', timeZone: 'Pacific/Fiji', abbreviation: 'FJT' },
  { id: '102', city: 'Port Moresby', country: 'Papua New Guinea', timeZone: 'Pacific/Port_Moresby', abbreviation: 'PGT' },

  // Additional Major Cities
  { id: '103', city: 'Reykjavik', country: 'Iceland', timeZone: 'Atlantic/Reykjavik', abbreviation: 'GMT' },
  { id: '104', city: 'Brasília', country: 'Brazil', timeZone: 'America/Sao_Paulo', abbreviation: 'BRT/BRST' },
  { id: '105', city: 'Montevideo', country: 'Uruguay', timeZone: 'America/Montevideo', abbreviation: 'UYT/UYST' },
  { id: '106', city: 'Asunción', country: 'Paraguay', timeZone: 'America/Asuncion', abbreviation: 'PYT/PYST' },
  { id: '107', city: 'La Paz', country: 'Bolivia', timeZone: 'America/La_Paz', abbreviation: 'BOT' },
  { id: '108', city: 'Quito', country: 'Ecuador', timeZone: 'America/Guayaquil', abbreviation: 'ECT' },
  { id: '109', city: 'Panama City', country: 'Panama', timeZone: 'America/Panama', abbreviation: 'EST' },
  { id: '110', city: 'San José', country: 'Costa Rica', timeZone: 'America/Costa_Rica', abbreviation: 'CST' },
  { id: '111', city: 'Guatemala City', country: 'Guatemala', timeZone: 'America/Guatemala', abbreviation: 'CST' },
  { id: '112', city: 'Havana', country: 'Cuba', timeZone: 'America/Havana', abbreviation: 'CST/CDT' },
  { id: '113', city: 'Kingston', country: 'Jamaica', timeZone: 'America/Jamaica', abbreviation: 'EST' },

  // US States (Capital Cities)
  { id: '114', city: 'Montgomery', country: 'Alabama, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '115', city: 'Juneau', country: 'Alaska, United States', timeZone: 'America/Anchorage', abbreviation: 'AKST/AKDT' },
  { id: '116', city: 'Phoenix', country: 'Arizona, United States', timeZone: 'America/Phoenix', abbreviation: 'MST' },
  { id: '117', city: 'Little Rock', country: 'Arkansas, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '118', city: 'Sacramento', country: 'California, United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '119', city: 'Denver', country: 'Colorado, United States', timeZone: 'America/Denver', abbreviation: 'MST/MDT' },
  { id: '120', city: 'Hartford', country: 'Connecticut, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '121', city: 'Dover', country: 'Delaware, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '122', city: 'Tallahassee', country: 'Florida, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '123', city: 'Atlanta', country: 'Georgia, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '124', city: 'Honolulu', country: 'Hawaii, United States', timeZone: 'Pacific/Honolulu', abbreviation: 'HST' },
  { id: '125', city: 'Boise', country: 'Idaho, United States', timeZone: 'America/Boise', abbreviation: 'MST/MDT' },
  { id: '126', city: 'Springfield', country: 'Illinois, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '127', city: 'Indianapolis', country: 'Indiana, United States', timeZone: 'America/Indiana/Indianapolis', abbreviation: 'EST/EDT' },
  { id: '128', city: 'Des Moines', country: 'Iowa, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '129', city: 'Topeka', country: 'Kansas, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '130', city: 'Frankfort', country: 'Kentucky, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '131', city: 'Baton Rouge', country: 'Louisiana, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '132', city: 'Augusta', country: 'Maine, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '133', city: 'Annapolis', country: 'Maryland, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '134', city: 'Boston', country: 'Massachusetts, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '135', city: 'Lansing', country: 'Michigan, United States', timeZone: 'America/Detroit', abbreviation: 'EST/EDT' },
  { id: '136', city: 'Saint Paul', country: 'Minnesota, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '137', city: 'Jackson', country: 'Mississippi, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '138', city: 'Jefferson City', country: 'Missouri, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '139', city: 'Helena', country: 'Montana, United States', timeZone: 'America/Denver', abbreviation: 'MST/MDT' },
  { id: '140', city: 'Lincoln', country: 'Nebraska, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '141', city: 'Carson City', country: 'Nevada, United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '142', city: 'Concord', country: 'New Hampshire, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '143', city: 'Trenton', country: 'New Jersey, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '144', city: 'Santa Fe', country: 'New Mexico, United States', timeZone: 'America/Denver', abbreviation: 'MST/MDT' },
  { id: '145', city: 'Albany', country: 'New York, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '146', city: 'Raleigh', country: 'North Carolina, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '147', city: 'Bismarck', country: 'North Dakota, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '148', city: 'Columbus', country: 'Ohio, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '149', city: 'Oklahoma City', country: 'Oklahoma, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '150', city: 'Salem', country: 'Oregon, United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '151', city: 'Harrisburg', country: 'Pennsylvania, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '152', city: 'Providence', country: 'Rhode Island, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '153', city: 'Columbia', country: 'South Carolina, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '154', city: 'Pierre', country: 'South Dakota, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '155', city: 'Nashville', country: 'Tennessee, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '156', city: 'Austin', country: 'Texas, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '157', city: 'Salt Lake City', country: 'Utah, United States', timeZone: 'America/Denver', abbreviation: 'MST/MDT' },
  { id: '158', city: 'Montpelier', country: 'Vermont, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '159', city: 'Richmond', country: 'Virginia, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '160', city: 'Olympia', country: 'Washington, United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '161', city: 'Charleston', country: 'West Virginia, United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '162', city: 'Madison', country: 'Wisconsin, United States', timeZone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { id: '163', city: 'Cheyenne', country: 'Wyoming, United States', timeZone: 'America/Denver', abbreviation: 'MST/MDT' },

  // Canadian Provinces and Territories (Capital Cities)
  { id: '164', city: 'Edmonton', country: 'Alberta, Canada', timeZone: 'America/Edmonton', abbreviation: 'MST/MDT' },
  { id: '165', city: 'Victoria', country: 'British Columbia, Canada', timeZone: 'America/Vancouver', abbreviation: 'PST/PDT' },
  { id: '166', city: 'Winnipeg', country: 'Manitoba, Canada', timeZone: 'America/Winnipeg', abbreviation: 'CST/CDT' },
  { id: '167', city: 'Fredericton', country: 'New Brunswick, Canada', timeZone: 'America/Moncton', abbreviation: 'AST/ADT' },
  { id: '168', city: 'St. John\'s', country: 'Newfoundland and Labrador, Canada', timeZone: 'America/St_Johns', abbreviation: 'NST/NDT' },
  { id: '169', city: 'Yellowknife', country: 'Northwest Territories, Canada', timeZone: 'America/Yellowknife', abbreviation: 'MST/MDT' },
  { id: '170', city: 'Halifax', country: 'Nova Scotia, Canada', timeZone: 'America/Halifax', abbreviation: 'AST/ADT' },
  { id: '171', city: 'Iqaluit', country: 'Nunavut, Canada', timeZone: 'America/Iqaluit', abbreviation: 'EST/EDT' },
  { id: '172', city: 'Toronto', country: 'Ontario, Canada', timeZone: 'America/Toronto', abbreviation: 'EST/EDT' },
  { id: '173', city: 'Charlottetown', country: 'Prince Edward Island, Canada', timeZone: 'America/Halifax', abbreviation: 'AST/ADT' },
  { id: '174', city: 'Quebec City', country: 'Quebec, Canada', timeZone: 'America/Montreal', abbreviation: 'EST/EDT' },
  { id: '175', city: 'Regina', country: 'Saskatchewan, Canada', timeZone: 'America/Regina', abbreviation: 'CST' },
  { id: '176', city: 'Whitehorse', country: 'Yukon, Canada', timeZone: 'America/Whitehorse', abbreviation: 'PST/PDT' }
]

const fontFamilies = [
  'Times New Roman', 'Arial', 'Helvetica', 'Georgia', 'Verdana',
  'Courier New', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Palatino',
  'Garamond', 'Bookman', 'Avant Garde', 'Optima', 'Futura',
  'Gill Sans', 'Century Gothic', 'Franklin Gothic', 'Lucida Console', 'Monaco'
]

const analogColors = [
  'silver', 'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange',
  'purple', 'pink', 'brown', 'gray', 'gold', 'navy', 'maroon',
  'olive', 'lime', 'aqua', 'teal', 'fuchsia'
]

const analogDesigns = [
  'Classic Elegance', 'Modern Minimalist', 'Vintage Brass', 'Ocean Blue',
  'Sunset Gold', 'Forest Green', 'Royal Purple', 'Rose Gold',
  'Midnight Black', 'Arctic White', 'Copper Glow', 'Ruby Red',
  'Sapphire Blue', 'Emerald Green', 'Amber Warmth', 'Platinum Shine',
  'Cherry Blossom', 'Deep Ocean', 'Golden Hour', 'Northern Lights'
]

function WorldClock() {
  const { user, logout } = useUser()
  
  // Use user-specific keys for settings storage
  const userSettingsKey = user ? `world-clock-settings-${user.id}` : 'world-clock-settings'
  const userTimezonesKey = user ? `world-clock-timezones-${user.id}` : 'world-clock-timezones'
  
  const [activeTimeZones, setActiveTimeZones] = useKV<TimeZoneInfo[]>(userTimezonesKey, defaultTimeZones)
  const [settings, setSettings] = useKV<ClockSettings>(userSettingsKey, {
    showAnalog: true,
    fontFamily: 'Times New Roman',
    countryNameSize: 30,
    cityNameSize: 30,
    timeZoneSize: 30,
    showDigitalSeconds: true,
    digitalDateSize: 20,
    digitalTimeSize: 30,
    showAnalogSeconds: true,
    analogClockSize: 200,
    analogClockDesign: 'Classic Elegance',
    analogClockColor: 'silver',
    analogNumberSize: true,
    analogNumberFontSize: 20
  })

  // Load user's saved server settings when user changes
  useEffect(() => {
    const loadServerSettings = async () => {
      if (user) {
        try {
          const serverSettings = await spark.kv.get<ClockSettings>(`world-clock-server-settings-${user.id}`)
          const serverTimezones = await spark.kv.get<TimeZoneInfo[]>(`world-clock-server-timezones-${user.id}`)
          
          if (serverSettings) {
            setSettings(serverSettings)
          }
          if (serverTimezones) {
            setActiveTimeZones(serverTimezones)
          }
        } catch (error) {
          console.error('Failed to load server settings:', error)
        }
      }
    }
    
    loadServerSettings()
  }, [user, setSettings, setActiveTimeZones])

  const [showConfig, setShowConfig] = useState(false)
  const [showAddClock, setShowAddClock] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [openPopups, setOpenPopups] = useState<Map<string, Window>>(new Map())

  const [configSections, setConfigSections] = useState({
    common: true,
    digital: false,
    analog: false
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Synchronize settings with all open popups
  useEffect(() => {
    openPopups.forEach((popup, timezoneId) => {
      if (popup && !popup.closed && popup.postMessage) {
        try {
          popup.postMessage({
            type: 'UPDATE_SETTINGS',
            settings: settings
          }, '*')
        } catch (error) {
          console.warn('Failed to send message to popup:', error)
          // Remove closed popup from tracking
          setOpenPopups(prev => {
            const newMap = new Map(prev)
            newMap.delete(timezoneId)
            return newMap
          })
        }
      }
    })
  }, [settings, openPopups])

  // Clean up closed popups periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      setOpenPopups(prev => {
        const newMap = new Map(prev)
        let hasChanges = false
        
        newMap.forEach((popup, timezoneId) => {
          if (popup.closed) {
            newMap.delete(timezoneId)
            hasChanges = true
          }
        })
        
        return hasChanges ? newMap : prev
      })
    }, 5000)
    
    return () => clearInterval(cleanup)
  }, [])

  // Listen for messages from popup windows
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'POPUP_CLOSING') {
        setOpenPopups(prev => {
          const newMap = new Map(prev)
          newMap.delete(event.data.timezoneId)
          return newMap
        })
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const getTimeForZone = (timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      weekday: 'short'
    }).formatToParts(currentTime)
  }

  const formatTime = (parts: Intl.DateTimeFormatPart[], includeSeconds: boolean) => {
    const time = parts.reduce((acc, part) => {
      acc[part.type] = part.value
      return acc
    }, {} as any)

    const timeStr = includeSeconds 
      ? `${time.hour}:${time.minute}:${time.second}`
      : `${time.hour}:${time.minute}`
    
    const dateStr = `${time.year}-${time.month}-${time.day} ${time.weekday}`
    
    return { time: timeStr, date: dateStr }
  }

  const addTimeZone = (timezone: TimeZoneInfo) => {
    const exists = activeTimeZones.some(tz => tz.timeZone === timezone.timeZone && tz.city === timezone.city)
    if (!exists) {
      setActiveTimeZones(current => [...current, { ...timezone, id: Date.now().toString() }])
    }
    setShowAddClock(false)
    setSearchText('')
  }

  const removeTimeZone = (id: string) => {
    setActiveTimeZones(current => current.filter(tz => tz.id !== id))
  }

  const filteredTimeZones = availableTimeZones.filter(tz => 
    tz.city.toLowerCase().includes(searchText.toLowerCase()) ||
    tz.country.toLowerCase().includes(searchText.toLowerCase()) ||
    tz.abbreviation.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (index: number) => {
    setDragOverIndex(index)
  }

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null) return
    
    setActiveTimeZones(current => {
      const newArray = [...current]
      const draggedItem = newArray[draggedIndex]
      newArray.splice(draggedIndex, 1)
      newArray.splice(dropIndex, 0, draggedItem)
      return newArray
    })
    
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const openClockPopup = (timezone: TimeZoneInfo) => {
    // Check if popup already exists for this timezone
    const existingPopup = openPopups.get(timezone.id)
    if (existingPopup && !existingPopup.closed) {
      existingPopup.focus()
      return
    }

    // Calculate popup window size based on settings
    const popupWidth = Math.max(
      settings.showAnalog ? settings.analogClockSize + 80 : 280,
      Math.max(
        timezone.country.length * settings.countryNameSize * 0.6 + 40,
        timezone.city.length * settings.cityNameSize * 0.6 + 40,
        '00:00:00'.length * settings.digitalTimeSize * 0.6 + 40
      )
    )
    
    // Calculate popup height more accurately based on content
    let popupHeight = 40 + 48 // body padding (20*2) + container padding (24*2)
    popupHeight += settings.countryNameSize + 4 // country name + margin
    popupHeight += settings.cityNameSize + 4 // city name + margin  
    popupHeight += settings.timeZoneSize + 16 // timezone + margin
    popupHeight += settings.digitalDateSize + 8 // date + margin
    popupHeight += settings.digitalTimeSize + (settings.showAnalog ? 20 : 0) // time + margin
    
    if (settings.showAnalog) {
      popupHeight += settings.analogClockSize + 16 + 32 // analog clock + margin + decoration space
    }
    
    popupHeight += 40 // extra buffer for safe display

    // Center the popup on screen
    const left = (window.screen.width - popupWidth) / 2
    const top = (window.screen.height - popupHeight) / 2

    // Create popup window with minimal features
    const popup = window.open(
      '', 
      `clock-${timezone.id}`,
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`
    )

    if (popup) {
      // Track the popup
      setOpenPopups(prev => new Map(prev).set(timezone.id, popup))

      // Create the popup content
      const popupContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${timezone.city} - ${timezone.country}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: ${settings.fontFamily}, sans-serif;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 20px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .clock-container {
              background: white;
              border-radius: 12px;
              padding: 24px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              text-align: center;
              border: 1px solid #e2e8f0;
            }
            
            .country-name {
              font-size: ${settings.countryNameSize}px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 4px;
            }
            
            .city-name {
              font-size: ${settings.cityNameSize}px;
              font-weight: 500;
              color: #334155;
              margin-bottom: 4px;
            }
            
            .timezone-abbr {
              font-size: ${settings.timeZoneSize}px;
              color: #64748b;
              margin-bottom: 16px;
            }
            
            .digital-date {
              font-size: ${settings.digitalDateSize}px;
              color: #64748b;
              margin-bottom: 8px;
            }
            
            .digital-time {
              font-size: ${settings.digitalTimeSize}px;
              font-weight: bold;
              color: #1e293b;
              font-variant-numeric: tabular-nums;
              margin-bottom: ${settings.showAnalog ? '20px' : '0'};
            }
            
            .analog-clock-container {
              display: flex;
              justify-content: center;
              margin-top: 16px;
            }
          </style>
        </head>
        <body>
          <div class="clock-container">
            <div class="country-name">${timezone.country}</div>
            <div class="city-name">${timezone.city}</div>
            <div class="timezone-abbr">${timezone.abbreviation}</div>
            <div class="digital-date" id="date"></div>
            <div class="digital-time" id="time"></div>
            ${settings.showAnalog ? '<div class="analog-clock-container" id="analog-clock"></div>' : ''}
          </div>
          
          <script>
            const timezone = '${timezone.timeZone}';
            let currentSettings = ${JSON.stringify(settings)};
            
            // Listen for settings updates from parent window
            window.addEventListener('message', function(event) {
              if (event.data && event.data.type === 'UPDATE_SETTINGS') {
                currentSettings = event.data.settings;
                updateStyles();
                updateClock(); // Refresh display immediately
              }
            });
            
            function updateStyles() {
              // Update font family
              document.body.style.fontFamily = currentSettings.fontFamily + ', sans-serif';
              
              // Update element sizes
              const countryEl = document.querySelector('.country-name');
              const cityEl = document.querySelector('.city-name');
              const timezoneEl = document.querySelector('.timezone-abbr');
              const dateEl = document.querySelector('.digital-date');
              const timeEl = document.querySelector('.digital-time');
              
              if (countryEl) countryEl.style.fontSize = currentSettings.countryNameSize + 'px';
              if (cityEl) cityEl.style.fontSize = currentSettings.cityNameSize + 'px';
              if (timezoneEl) timezoneEl.style.fontSize = currentSettings.timeZoneSize + 'px';
              if (dateEl) dateEl.style.fontSize = currentSettings.digitalDateSize + 'px';
              if (timeEl) {
                timeEl.style.fontSize = currentSettings.digitalTimeSize + 'px';
                timeEl.style.marginBottom = currentSettings.showAnalog ? '20px' : '0';
              }
              
              // Show/hide analog clock
              const analogContainer = document.getElementById('analog-clock');
              if (analogContainer) {
                analogContainer.style.display = currentSettings.showAnalog ? 'flex' : 'none';
              }
            }
            
            const getDesignStyles = (design) => {
              const designs = {
                'Classic Elegance': {
                  background: 'radial-gradient(circle, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
                  shadow: '0 8px 32px rgba(33, 37, 41, 0.3)',
                  border: '4px solid #6c757d',
                  decoration: 'linear-gradient(45deg, #495057, #6c757d)'
                },
                'Modern Minimalist': {
                  background: 'radial-gradient(circle, #ffffff 0%, #f8f9fa 70%, #e9ecef 100%)',
                  shadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #dee2e6',
                  decoration: 'linear-gradient(45deg, #adb5bd, #ced4da)'
                },
                'Vintage Brass': {
                  background: 'radial-gradient(circle, #fff8e1 0%, #ffecb3 50%, #ffc107 100%)',
                  shadow: '0 8px 32px rgba(255, 193, 7, 0.4)',
                  border: '6px solid #ff8f00',
                  decoration: 'linear-gradient(45deg, #ff6f00, #ff8f00)'
                },
                'Ocean Blue': {
                  background: 'radial-gradient(circle, #e3f2fd 0%, #bbdefb 50%, #2196f3 100%)',
                  shadow: '0 8px 32px rgba(33, 150, 243, 0.4)',
                  border: '4px solid #1976d2',
                  decoration: 'linear-gradient(45deg, #0d47a1, #1976d2)'
                },
                'Sunset Gold': {
                  background: 'radial-gradient(circle, #fff3e0 0%, #ffcc02 50%, #ff9800 100%)',
                  shadow: '0 8px 32px rgba(255, 152, 0, 0.4)',
                  border: '4px solid #f57c00',
                  decoration: 'linear-gradient(45deg, #e65100, #f57c00)'
                },
                'Forest Green': {
                  background: 'radial-gradient(circle, #e8f5e8 0%, #c8e6c9 50%, #4caf50 100%)',
                  shadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
                  border: '4px solid #388e3c',
                  decoration: 'linear-gradient(45deg, #1b5e20, #388e3c)'
                },
                'Royal Purple': {
                  background: 'radial-gradient(circle, #f3e5f5 0%, #e1bee7 50%, #9c27b0 100%)',
                  shadow: '0 8px 32px rgba(156, 39, 176, 0.4)',
                  border: '4px solid #7b1fa2',
                  decoration: 'linear-gradient(45deg, #4a148c, #7b1fa2)'
                },
                'Rose Gold': {
                  background: 'radial-gradient(circle, #fce4ec 0%, #f8bbd9 50%, #e91e63 100%)',
                  shadow: '0 8px 32px rgba(233, 30, 99, 0.4)',
                  border: '4px solid #c2185b',
                  decoration: 'linear-gradient(45deg, #880e4f, #c2185b)'
                },
                'Midnight Black': {
                  background: 'radial-gradient(circle, #424242 0%, #212121 50%, #000000 100%)',
                  shadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  border: '4px solid #616161',
                  decoration: 'linear-gradient(45deg, #212121, #424242)'
                },
                'Arctic White': {
                  background: 'radial-gradient(circle, #ffffff 0%, #fafafa 50%, #f5f5f5 100%)',
                  shadow: '0 8px 32px rgba(158, 158, 158, 0.3)',
                  border: '4px solid #e0e0e0',
                  decoration: 'linear-gradient(45deg, #bdbdbd, #e0e0e0)'
                },
                'Copper Glow': {
                  background: 'radial-gradient(circle, #fff8e1 0%, #ffcc02 50%, #ff5722 100%)',
                  shadow: '0 8px 32px rgba(255, 87, 34, 0.4)',
                  border: '4px solid #d84315',
                  decoration: 'linear-gradient(45deg, #bf360c, #d84315)'
                },
                'Ruby Red': {
                  background: 'radial-gradient(circle, #ffebee 0%, #ffcdd2 50%, #f44336 100%)',
                  shadow: '0 8px 32px rgba(244, 67, 54, 0.4)',
                  border: '4px solid #d32f2f',
                  decoration: 'linear-gradient(45deg, #b71c1c, #d32f2f)'
                },
                'Sapphire Blue': {
                  background: 'radial-gradient(circle, #e8eaf6 0%, #c5cae9 50%, #3f51b5 100%)',
                  shadow: '0 8px 32px rgba(63, 81, 181, 0.4)',
                  border: '4px solid #303f9f',
                  decoration: 'linear-gradient(45deg, #1a237e, #303f9f)'
                },
                'Emerald Green': {
                  background: 'radial-gradient(circle, #e0f2f1 0%, #b2dfdb 50%, #009688 100%)',
                  shadow: '0 8px 32px rgba(0, 150, 136, 0.4)',
                  border: '4px solid #00796b',
                  decoration: 'linear-gradient(45deg, #004d40, #00796b)'
                },
                'Amber Warmth': {
                  background: 'radial-gradient(circle, #fff8e1 0%, #ffecb3 50%, #ffc107 100%)',
                  shadow: '0 8px 32px rgba(255, 193, 7, 0.4)',
                  border: '4px solid #ffa000',
                  decoration: 'linear-gradient(45deg, #ff6f00, #ffa000)'
                },
                'Platinum Shine': {
                  background: 'radial-gradient(circle, #fafafa 0%, #eeeeee 50%, #9e9e9e 100%)',
                  shadow: '0 8px 32px rgba(158, 158, 158, 0.4)',
                  border: '4px solid #757575',
                  decoration: 'linear-gradient(45deg, #424242, #757575)'
                },
                'Cherry Blossom': {
                  background: 'radial-gradient(circle, #fce4ec 0%, #f8bbd9 50%, #e91e63 100%)',
                  shadow: '0 8px 32px rgba(233, 30, 99, 0.4)',
                  border: '4px solid #c2185b',
                  decoration: 'linear-gradient(45deg, #880e4f, #c2185b)'
                },
                'Deep Ocean': {
                  background: 'radial-gradient(circle, #e1f5fe 0%, #b3e5fc 50%, #03a9f4 100%)',
                  shadow: '0 8px 32px rgba(3, 169, 244, 0.4)',
                  border: '4px solid #0288d1',
                  decoration: 'linear-gradient(45deg, #01579b, #0288d1)'
                },
                'Golden Hour': {
                  background: 'radial-gradient(circle, #fff8e1 0%, #ffe082 50%, #ffb300 100%)',
                  shadow: '0 8px 32px rgba(255, 179, 0, 0.4)',
                  border: '4px solid #ff8f00',
                  decoration: 'linear-gradient(45deg, #ff6f00, #ff8f00)'
                },
                'Northern Lights': {
                  background: 'radial-gradient(circle, #e8f5e8 0%, #81c784 50%, #00e676 100%)',
                  shadow: '0 8px 32px rgba(0, 230, 118, 0.4)',
                  border: '4px solid #00c853',
                  decoration: 'linear-gradient(45deg, #00695c, #00c853)'
                }
              };
              return designs[design] || designs['Classic Elegance'];
            };
            
            function updateClock() {
              const now = new Date();
              const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                weekday: 'short'
              });
              
              const parts = formatter.formatToParts(now);
              const timeData = parts.reduce((acc, part) => {
                acc[part.type] = part.value;
                return acc;
              }, {});
              
              const timeStr = currentSettings.showDigitalSeconds 
                ? timeData.hour + ':' + timeData.minute + ':' + timeData.second
                : timeData.hour + ':' + timeData.minute;
                
              const dateStr = timeData.year + '-' + timeData.month + '-' + timeData.day + ' ' + timeData.weekday;
              
              document.getElementById('date').textContent = dateStr;
              document.getElementById('time').textContent = timeStr;
              
              if (currentSettings.showAnalog) {
                updateAnalogClock(parseInt(timeData.hour), parseInt(timeData.minute), parseInt(timeData.second));
              }
            }
            
            function updateAnalogClock(hours, minutes, seconds) {
              const analogContainer = document.getElementById('analog-clock');
              if (!analogContainer || !currentSettings.showAnalog) return;
              
              const hourAngle = (hours % 12) * 30 + minutes * 0.5;
              const minuteAngle = minutes * 6;
              const secondAngle = seconds * 6;
              const designStyles = getDesignStyles(currentSettings.analogClockDesign);
              const analogClockSize = currentSettings.analogClockSize;
              
              analogContainer.innerHTML = \`
                <div style="position: relative; width: \${analogClockSize}px; height: \${analogClockSize}px;">
                  <div style="
                    position: absolute;
                    background: \${designStyles.decoration};
                    width: \${analogClockSize + 16}px;
                    height: \${analogClockSize + 16}px;
                    left: -8px;
                    top: -8px;
                    border-radius: 50%;
                  "></div>
                  <svg width="\${analogClockSize}" height="\${analogClockSize}" style="
                    position: relative;
                    border-radius: 50%;
                    background: \${designStyles.background};
                    box-shadow: \${designStyles.shadow};
                    border: 4px solid \${currentSettings.analogClockColor};
                  ">
                    <defs>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
                      </filter>
                    </defs>
                    
                    \${currentSettings.analogNumberSize ? Array.from({ length: 12 }, (_, i) => {
                      const angle = (i + 1) * 30 - 90;
                      const x = analogClockSize/2 + (analogClockSize/2 - 30) * Math.cos(angle * Math.PI / 180);
                      const y = analogClockSize/2 + (analogClockSize/2 - 30) * Math.sin(angle * Math.PI / 180);
                      return \`<text x="\${x}" y="\${y}" text-anchor="middle" dominant-baseline="central" 
                        font-size="\${currentSettings.analogNumberFontSize}" font-family="\${currentSettings.fontFamily}" 
                        fill="\${currentSettings.analogClockColor}" font-weight="bold" filter="url(#shadow)">\${i + 1}</text>\`;
                    }).join('') : ''}
                    
                    <line x1="\${analogClockSize/2}" y1="\${analogClockSize/2}"
                          x2="\${analogClockSize/2 + (analogClockSize/4) * Math.cos((hourAngle - 90) * Math.PI / 180)}"
                          y2="\${analogClockSize/2 + (analogClockSize/4) * Math.sin((hourAngle - 90) * Math.PI / 180)}"
                          stroke="\${currentSettings.analogClockColor}" stroke-width="6" stroke-linecap="round" filter="url(#shadow)" />
                    
                    <line x1="\${analogClockSize/2}" y1="\${analogClockSize/2}"
                          x2="\${analogClockSize/2 + (analogClockSize/3) * Math.cos((minuteAngle - 90) * Math.PI / 180)}"
                          y2="\${analogClockSize/2 + (analogClockSize/3) * Math.sin((minuteAngle - 90) * Math.PI / 180)}"
                          stroke="\${currentSettings.analogClockColor}" stroke-width="4" stroke-linecap="round" filter="url(#shadow)" />
                    
                    \${currentSettings.showAnalogSeconds ? \`<line x1="\${analogClockSize/2}" y1="\${analogClockSize/2}"
                          x2="\${analogClockSize/2 + (analogClockSize/2.5) * Math.cos((secondAngle - 90) * Math.PI / 180)}"
                          y2="\${analogClockSize/2 + (analogClockSize/2.5) * Math.sin((secondAngle - 90) * Math.PI / 180)}"
                          stroke="#ef4444" stroke-width="2" stroke-linecap="round" filter="url(#shadow)" />\` : ''}
                    
                    <circle cx="\${analogClockSize/2}" cy="\${analogClockSize/2}" r="8" 
                            fill="\${currentSettings.analogClockColor}" filter="url(#shadow)" />
                  </svg>
                </div>
              \`;
            }
            
            // Update immediately and then every second
            updateClock();
            setInterval(updateClock, 1000);
            
            // Handle window close
            window.addEventListener('beforeunload', () => {
              // Send close message to parent
              try {
                if (window.opener && !window.opener.closed) {
                  window.opener.postMessage({
                    type: 'POPUP_CLOSING',
                    timezoneId: '${timezone.id}'
                  }, '*');
                }
              } catch (error) {
                // Ignore cross-origin errors
              }
            });
          </script>
        </body>
        </html>
      `

      popup.document.write(popupContent)
      popup.document.close()
      
      // Set window title
      popup.document.title = `${timezone.city} - ${timezone.country}`
      
      // Focus the popup
      popup.focus()
    }
  }

  const saveSettingsToServer = async () => {
    if (!user) {
      toast.error('Please log in to save settings')
      return
    }
    
    setIsSaving(true)
    try {
      // Save user-specific settings to server using spark.kv API
      await spark.kv.set(`world-clock-server-settings-${user.id}`, settings)
      await spark.kv.set(`world-clock-server-timezones-${user.id}`, activeTimeZones)
      
      // Show success notification
      toast.success('Settings saved to server successfully!')
    } catch (error) {
      console.error('Failed to save settings to server:', error)
      toast.error('Failed to save settings to server')
    } finally {
      setIsSaving(false)
    }
  }

  const loadSettingsFromServer = async () => {
    if (!user) {
      toast.error('Please log in to load settings')
      return
    }
    
    setIsSaving(true)
    try {
      const serverSettings = await spark.kv.get<ClockSettings>(`world-clock-server-settings-${user.id}`)
      const serverTimezones = await spark.kv.get<TimeZoneInfo[]>(`world-clock-server-timezones-${user.id}`)
      
      if (serverSettings || serverTimezones) {
        if (serverSettings) {
          setSettings(serverSettings)
        }
        if (serverTimezones) {
          setActiveTimeZones(serverTimezones)
        }
        toast.success('Settings loaded from server successfully!')
      } else {
        toast.info('No saved settings found on server')
      }
    } catch (error) {
      console.error('Failed to load settings from server:', error)
      toast.error('Failed to load settings from server')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
  }

  const AnalogClock = ({ timezone, size }: { timezone: TimeZoneInfo; size: number }) => {
    const timeParts = getTimeForZone(timezone.timeZone)
    const time = formatTime(timeParts, true)
    
    const [hours, minutes, seconds] = time.time.split(':').map(Number)
    const hourAngle = (hours % 12) * 30 + minutes * 0.5
    const minuteAngle = minutes * 6
    const secondAngle = seconds * 6

    const getDesignStyles = (design: string) => {
      const designs: Record<string, any> = {
        'Classic Elegance': {
          background: 'radial-gradient(circle, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
          shadow: '0 8px 32px rgba(33, 37, 41, 0.3)',
          border: '4px solid #6c757d',
          decoration: 'linear-gradient(45deg, #495057, #6c757d)'
        },
        'Modern Minimalist': {
          background: 'radial-gradient(circle, #ffffff 0%, #f8f9fa 70%, #e9ecef 100%)',
          shadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '2px solid #dee2e6',
          decoration: 'linear-gradient(45deg, #adb5bd, #ced4da)'
        },
        'Vintage Brass': {
          background: 'radial-gradient(circle, #fff8e1 0%, #ffecb3 50%, #ffc107 100%)',
          shadow: '0 8px 32px rgba(255, 193, 7, 0.4)',
          border: '6px solid #ff8f00',
          decoration: 'linear-gradient(45deg, #ff6f00, #ff8f00)'
        },
        'Ocean Blue': {
          background: 'radial-gradient(circle, #e3f2fd 0%, #bbdefb 50%, #2196f3 100%)',
          shadow: '0 8px 32px rgba(33, 150, 243, 0.4)',
          border: '4px solid #1976d2',
          decoration: 'linear-gradient(45deg, #0d47a1, #1976d2)'
        },
        'Sunset Gold': {
          background: 'radial-gradient(circle, #fff3e0 0%, #ffcc02 50%, #ff9800 100%)',
          shadow: '0 8px 32px rgba(255, 152, 0, 0.4)',
          border: '4px solid #f57c00',
          decoration: 'linear-gradient(45deg, #e65100, #f57c00)'
        },
        'Forest Green': {
          background: 'radial-gradient(circle, #e8f5e8 0%, #c8e6c9 50%, #4caf50 100%)',
          shadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
          border: '4px solid #388e3c',
          decoration: 'linear-gradient(45deg, #1b5e20, #388e3c)'
        },
        'Royal Purple': {
          background: 'radial-gradient(circle, #f3e5f5 0%, #e1bee7 50%, #9c27b0 100%)',
          shadow: '0 8px 32px rgba(156, 39, 176, 0.4)',
          border: '4px solid #7b1fa2',
          decoration: 'linear-gradient(45deg, #4a148c, #7b1fa2)'
        },
        'Rose Gold': {
          background: 'radial-gradient(circle, #fce4ec 0%, #f8bbd9 50%, #e91e63 100%)',
          shadow: '0 8px 32px rgba(233, 30, 99, 0.4)',
          border: '4px solid #c2185b',
          decoration: 'linear-gradient(45deg, #880e4f, #c2185b)'
        },
        'Midnight Black': {
          background: 'radial-gradient(circle, #424242 0%, #212121 50%, #000000 100%)',
          shadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          border: '4px solid #616161',
          decoration: 'linear-gradient(45deg, #212121, #424242)'
        },
        'Arctic White': {
          background: 'radial-gradient(circle, #ffffff 0%, #fafafa 50%, #f5f5f5 100%)',
          shadow: '0 8px 32px rgba(158, 158, 158, 0.3)',
          border: '4px solid #e0e0e0',
          decoration: 'linear-gradient(45deg, #bdbdbd, #e0e0e0)'
        },
        'Copper Glow': {
          background: 'radial-gradient(circle, #fff8e1 0%, #ffcc02 50%, #ff5722 100%)',
          shadow: '0 8px 32px rgba(255, 87, 34, 0.4)',
          border: '4px solid #d84315',
          decoration: 'linear-gradient(45deg, #bf360c, #d84315)'
        },
        'Ruby Red': {
          background: 'radial-gradient(circle, #ffebee 0%, #ffcdd2 50%, #f44336 100%)',
          shadow: '0 8px 32px rgba(244, 67, 54, 0.4)',
          border: '4px solid #d32f2f',
          decoration: 'linear-gradient(45deg, #b71c1c, #d32f2f)'
        },
        'Sapphire Blue': {
          background: 'radial-gradient(circle, #e8eaf6 0%, #c5cae9 50%, #3f51b5 100%)',
          shadow: '0 8px 32px rgba(63, 81, 181, 0.4)',
          border: '4px solid #303f9f',
          decoration: 'linear-gradient(45deg, #1a237e, #303f9f)'
        },
        'Emerald Green': {
          background: 'radial-gradient(circle, #e0f2f1 0%, #b2dfdb 50%, #009688 100%)',
          shadow: '0 8px 32px rgba(0, 150, 136, 0.4)',
          border: '4px solid #00796b',
          decoration: 'linear-gradient(45deg, #004d40, #00796b)'
        },
        'Amber Warmth': {
          background: 'radial-gradient(circle, #fff8e1 0%, #ffecb3 50%, #ffc107 100%)',
          shadow: '0 8px 32px rgba(255, 193, 7, 0.4)',
          border: '4px solid #ffa000',
          decoration: 'linear-gradient(45deg, #ff6f00, #ffa000)'
        },
        'Platinum Shine': {
          background: 'radial-gradient(circle, #fafafa 0%, #eeeeee 50%, #9e9e9e 100%)',
          shadow: '0 8px 32px rgba(158, 158, 158, 0.4)',
          border: '4px solid #757575',
          decoration: 'linear-gradient(45deg, #424242, #757575)'
        },
        'Cherry Blossom': {
          background: 'radial-gradient(circle, #fce4ec 0%, #f8bbd9 50%, #e91e63 100%)',
          shadow: '0 8px 32px rgba(233, 30, 99, 0.4)',
          border: '4px solid #c2185b',
          decoration: 'linear-gradient(45deg, #880e4f, #c2185b)'
        },
        'Deep Ocean': {
          background: 'radial-gradient(circle, #e1f5fe 0%, #b3e5fc 50%, #03a9f4 100%)',
          shadow: '0 8px 32px rgba(3, 169, 244, 0.4)',
          border: '4px solid #0288d1',
          decoration: 'linear-gradient(45deg, #01579b, #0288d1)'
        },
        'Golden Hour': {
          background: 'radial-gradient(circle, #fff8e1 0%, #ffe082 50%, #ffb300 100%)',
          shadow: '0 8px 32px rgba(255, 179, 0, 0.4)',
          border: '4px solid #ff8f00',
          decoration: 'linear-gradient(45deg, #ff6f00, #ff8f00)'
        },
        'Northern Lights': {
          background: 'radial-gradient(circle, #e8f5e8 0%, #81c784 50%, #00e676 100%)',
          shadow: '0 8px 32px rgba(0, 230, 118, 0.4)',
          border: '4px solid #00c853',
          decoration: 'linear-gradient(45deg, #00695c, #00c853)'
        }
      }
      return designs[design] || designs['Classic Elegance']
    }

    const designStyles = getDesignStyles(settings.analogClockDesign)

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <div 
          className="absolute rounded-full"
          style={{ 
            background: designStyles.decoration,
            width: size + 16,
            height: size + 16,
            left: -8,
            top: -8
          }}
        />
        <svg 
          width={size} 
          height={size} 
          className="relative rounded-full border-4"
          style={{ 
            background: designStyles.background,
            boxShadow: designStyles.shadow,
            borderColor: settings.analogClockColor
          }}
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {settings.analogNumberSize && Array.from({ length: 12 }, (_, i) => {
            const angle = (i + 1) * 30 - 90
            const x = size/2 + (size/2 - 30) * Math.cos(angle * Math.PI / 180)
            const y = size/2 + (size/2 - 30) * Math.sin(angle * Math.PI / 180)
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={settings.analogNumberFontSize}
                fontFamily={settings.fontFamily}
                fill={settings.analogClockColor}
                fontWeight="bold"
                filter="url(#shadow)"
              >
                {i + 1}
              </text>
            )
          })}

          <line
            x1={size/2}
            y1={size/2}
            x2={size/2 + (size/4) * Math.cos((hourAngle - 90) * Math.PI / 180)}
            y2={size/2 + (size/4) * Math.sin((hourAngle - 90) * Math.PI / 180)}
            stroke={settings.analogClockColor}
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#shadow)"
          />

          <line
            x1={size/2}
            y1={size/2}
            x2={size/2 + (size/3) * Math.cos((minuteAngle - 90) * Math.PI / 180)}
            y2={size/2 + (size/3) * Math.sin((minuteAngle - 90) * Math.PI / 180)}
            stroke={settings.analogClockColor}
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#shadow)"
          />

          {settings.showAnalogSeconds && (
            <line
              x1={size/2}
              y1={size/2}
              x2={size/2 + (size/2.5) * Math.cos((secondAngle - 90) * Math.PI / 180)}
              y2={size/2 + (size/2.5) * Math.sin((secondAngle - 90) * Math.PI / 180)}
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#shadow)"
            />
          )}

          <circle
            cx={size/2}
            cy={size/2}
            r="8"
            fill={settings.analogClockColor}
            filter="url(#shadow)"
          />
        </svg>
      </div>
    )
  }

  const ClockCard = ({ timezone, index }: { timezone: TimeZoneInfo; index: number }) => {
    const timeParts = getTimeForZone(timezone.timeZone)
    const { time, date } = formatTime(timeParts, settings.showDigitalSeconds)

    const cardWidth = Math.max(
      settings.showAnalog ? settings.analogClockSize + 40 : 200,
      Math.max(
        timezone.country.length * settings.countryNameSize * 0.6,
        timezone.city.length * settings.cityNameSize * 0.6,
        time.length * settings.digitalTimeSize * 0.6
      )
    )

    return (
      <Card
        className={`p-6 bg-card text-card-foreground border-2 cursor-move transition-all duration-200 ${
          dragOverIndex === index ? 'ring-2 ring-accent' : ''
        } ${draggedIndex === index ? 'opacity-50' : ''}`}
        style={{ width: cardWidth, minHeight: settings.showAnalog ? settings.analogClockSize + 200 : 150 }}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => {
          e.preventDefault()
          handleDragOver(index)
        }}
        onDrop={() => handleDrop(index)}
      >
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -left-2 h-6 w-6 p-0 text-accent hover:text-accent-foreground hover:bg-accent z-10"
            onClick={() => openClockPopup(timezone)}
            title="Open in popup window"
          >
            <ArrowSquareOut size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
            onClick={() => removeTimeZone(timezone.id)}
          >
            <X size={14} />
          </Button>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <div 
                style={{ 
                  fontSize: settings.countryNameSize,
                  fontFamily: settings.fontFamily 
                }}
                className="font-semibold"
              >
                {timezone.country}
              </div>
              <div 
                style={{ 
                  fontSize: settings.cityNameSize,
                  fontFamily: settings.fontFamily 
                }}
                className="font-medium"
              >
                {timezone.city}
              </div>
              <div 
                style={{ 
                  fontSize: settings.timeZoneSize,
                  fontFamily: settings.fontFamily 
                }}
                className="text-muted-foreground"
              >
                {timezone.abbreviation}
              </div>
            </div>

            <div className="text-center">
              <div 
                style={{ 
                  fontSize: settings.digitalDateSize,
                  fontFamily: settings.fontFamily 
                }}
                className="text-muted-foreground"
              >
                {date}
              </div>
              <div 
                style={{ 
                  fontSize: settings.digitalTimeSize,
                  fontFamily: settings.fontFamily 
                }}
                className="font-bold tabular-nums"
              >
                {time}
              </div>
            </div>

            {settings.showAnalog && (
              <AnalogClock timezone={timezone} size={settings.analogClockSize} />
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Toaster />
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <h1 
            className="text-4xl font-bold text-foreground"
            style={{ fontFamily: settings.fontFamily }}
          >
            Daisuke World Clock
          </h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline font-medium">{user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem disabled>
                      <UserIcon className="mr-2 h-4 w-4" />
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <SignOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setShowAddClock(!showAddClock)}
                className="text-3xl p-2"
              >
                ➕
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={saveSettingsToServer}
                disabled={isSaving || !user}
                className="text-3xl p-2 hover:bg-accent/50"
                title={user ? "Save settings to server" : "Login required to save settings"}
              >
                <img 
                  src="https://cdn.vectorstock.com/i/500p/31/53/diskette-line-icon-floppy-disk-vector-25003153.jpg"
                  alt="Save"
                  width={36}
                  height={36}
                  className={`${isSaving ? 'animate-pulse' : ''} ${user ? 'opacity-100' : 'opacity-50'}`}
                  style={{ filter: user ? 'none' : 'grayscale(100%)' }}
                />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setShowConfig(!showConfig)}
                className="text-3xl p-2"
              >
                ⚙️
              </Button>
            </div>
          </div>
        </div>

        {!user && (
          <Card className="p-4 mb-6 bg-muted/50 border-dashed">
            <div className="text-center text-muted-foreground">
              <div className="text-sm">
                ⚠️ You are using the application without an account. 
                <br />
                Your settings will not be saved. Please log in to save your preferences.
              </div>
            </div>
          </Card>
        )}

        {showAddClock && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add Clock</h3>
            <div className="space-y-4">
              <Input
                placeholder="Search cities, countries, or time zones..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="max-h-40 overflow-y-auto space-y-2">
                {filteredTimeZones.map((tz) => (
                  <div
                    key={tz.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                    onClick={() => addTimeZone(tz)}
                  >
                    <div>
                      <div className="font-medium">{tz.city}</div>
                      <div className="text-sm text-muted-foreground">
                        {tz.country} • {tz.abbreviation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => setShowAddClock(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {showConfig && (
          <Card className="p-6 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Configuration</h3>
              {user && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSettingsFromServer}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    Load from Server
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveSettingsToServer}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <img 
                      src="https://cdn.vectorstock.com/i/500p/31/53/diskette-line-icon-floppy-disk-vector-25003153.jpg"
                      alt="Save"
                      width={16}
                      height={16}
                    />
                    Save to Server
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <div 
                  className="flex items-center gap-2 cursor-pointer mb-4"
                  onClick={() => setConfigSections(prev => ({ ...prev, common: !prev.common }))}
                >
                  {configSections.common ? <CaretDown size={16} /> : <CaretRight size={16} />}
                  <h4 className="font-medium">Common Settings</h4>
                </div>
                {configSections.common && (
                  <div className="ml-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-analog"
                        checked={settings.showAnalog}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, showAnalog: !!checked }))
                        }
                      />
                      <label htmlFor="show-analog">Show analog clock</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Font family</label>
                      <Select
                        value={settings.fontFamily}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, fontFamily: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontFamilies.map((font) => (
                            <SelectItem key={font} value={font}>{font}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Country name size: {settings.countryNameSize}px
                      </label>
                      <Slider
                        value={[settings.countryNameSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, countryNameSize: value }))
                        }
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City name size: {settings.cityNameSize}px
                      </label>
                      <Slider
                        value={[settings.cityNameSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, cityNameSize: value }))
                        }
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Time zone size: {settings.timeZoneSize}px
                      </label>
                      <Slider
                        value={[settings.timeZoneSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, timeZoneSize: value }))
                        }
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div 
                  className="flex items-center gap-2 cursor-pointer mb-4"
                  onClick={() => setConfigSections(prev => ({ ...prev, digital: !prev.digital }))}
                >
                  {configSections.digital ? <CaretDown size={16} /> : <CaretRight size={16} />}
                  <h4 className="font-medium">Digital Clock Settings</h4>
                </div>
                {configSections.digital && (
                  <div className="ml-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-digital-seconds"
                        checked={settings.showDigitalSeconds}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, showDigitalSeconds: !!checked }))
                        }
                      />
                      <label htmlFor="show-digital-seconds">Show seconds in digital clock</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Digital date size: {settings.digitalDateSize}px
                      </label>
                      <Slider
                        value={[settings.digitalDateSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, digitalDateSize: value }))
                        }
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Digital time size: {settings.digitalTimeSize}px
                      </label>
                      <Slider
                        value={[settings.digitalTimeSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, digitalTimeSize: value }))
                        }
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div 
                  className="flex items-center gap-2 cursor-pointer mb-4"
                  onClick={() => setConfigSections(prev => ({ ...prev, analog: !prev.analog }))}
                >
                  {configSections.analog ? <CaretDown size={16} /> : <CaretRight size={16} />}
                  <h4 className="font-medium">Analog Clock Settings</h4>
                </div>
                {configSections.analog && (
                  <div className="ml-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-analog-seconds"
                        checked={settings.showAnalogSeconds}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, showAnalogSeconds: !!checked }))
                        }
                      />
                      <label htmlFor="show-analog-seconds">Show second hand</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Clock size: {settings.analogClockSize}px
                      </label>
                      <Slider
                        value={[settings.analogClockSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, analogClockSize: value }))
                        }
                        min={50}
                        max={500}
                        step={10}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Clock design</label>
                      <Select
                        value={settings.analogClockDesign}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, analogClockDesign: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {analogDesigns.map((design) => (
                            <SelectItem key={design} value={design}>{design}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Clock color</label>
                      <Select
                        value={settings.analogClockColor}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, analogClockColor: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {analogColors.map((color) => (
                            <SelectItem key={color} value={color}>{color}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-numbers"
                        checked={settings.analogNumberSize}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, analogNumberSize: !!checked }))
                        }
                      />
                      <label htmlFor="show-numbers">Show numbers on analog clock</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Number size: {settings.analogNumberFontSize}px
                      </label>
                      <Slider
                        value={[settings.analogNumberFontSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, analogNumberFontSize: value }))
                        }
                        min={10}
                        max={50}
                        step={1}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-6" style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${Math.max(
            settings.showAnalog ? settings.analogClockSize + 40 : 200,
            300
          )}px, 1fr))`
        }}>
          {activeTimeZones.map((timezone, index) => (
            <ClockCard key={timezone.id} timezone={timezone} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function WorldClockApp() {
  const { user, login, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Daisuke World Clock</div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <UserAuth onLogin={login} />
  }

  return <WorldClock />
}

export default function App() {
  return (
    <UserProvider>
      <WorldClockApp />
    </UserProvider>
  )
}