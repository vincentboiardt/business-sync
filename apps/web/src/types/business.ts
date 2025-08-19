import { z } from 'zod'

// Zod schema for business profile validation
export const businessProfileSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  google_business_id: z.string().optional(),
  business_name: z.string().optional(), // Allow optional for incomplete profiles
  address: z.string().max(500, 'Address is too long').optional(),
  phone: z.string().max(50, 'Phone number is too long').optional(),
  website: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    }, 'Please enter a valid URL'),
  opening_hours: z.record(z.string(), z.string()).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Form schema for client-side validation (without server fields)
export const businessProfileFormSchema = businessProfileSchema
  .omit({
    id: true,
    user_id: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    // Keep validation for form submission
    business_name: z
      .string()
      .min(1, 'Business name is required')
      .max(255, 'Business name is too long'),
    address: z.string().max(500, 'Address is too long').optional(),
    phone: z.string().max(50, 'Phone number is too long').optional(),
    website: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val === '') return true
        try {
          new URL(val)
          return true
        } catch {
          return false
        }
      }, 'Please enter a valid URL'),
    opening_hours: z.record(z.string(), z.string()).optional(),
  })

// TypeScript types derived from schemas
export type BusinessProfile = z.infer<typeof businessProfileSchema>
export type BusinessProfileFormData = z.infer<typeof businessProfileFormSchema>

// Days of the week constant
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number]

// Time options for dropdowns (24-hour format for easier handling)
export const TIME_OPTIONS = [
  { value: '00:00', label: '12:00 AM' },
  { value: '00:30', label: '12:30 AM' },
  { value: '01:00', label: '1:00 AM' },
  { value: '01:30', label: '1:30 AM' },
  { value: '02:00', label: '2:00 AM' },
  { value: '02:30', label: '2:30 AM' },
  { value: '03:00', label: '3:00 AM' },
  { value: '03:30', label: '3:30 AM' },
  { value: '04:00', label: '4:00 AM' },
  { value: '04:30', label: '4:30 AM' },
  { value: '05:00', label: '5:00 AM' },
  { value: '05:30', label: '5:30 AM' },
  { value: '06:00', label: '6:00 AM' },
  { value: '06:30', label: '6:30 AM' },
  { value: '07:00', label: '7:00 AM' },
  { value: '07:30', label: '7:30 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '08:30', label: '8:30 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '09:30', label: '9:30 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '10:30', label: '10:30 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '12:30', label: '12:30 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '13:30', label: '1:30 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '14:30', label: '2:30 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '15:30', label: '3:30 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '16:30', label: '4:30 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '17:30', label: '5:30 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '18:30', label: '6:30 PM' },
  { value: '19:00', label: '7:00 PM' },
  { value: '19:30', label: '7:30 PM' },
  { value: '20:00', label: '8:00 PM' },
  { value: '20:30', label: '8:30 PM' },
  { value: '21:00', label: '9:00 PM' },
  { value: '21:30', label: '9:30 PM' },
  { value: '22:00', label: '10:00 PM' },
  { value: '22:30', label: '10:30 PM' },
  { value: '23:00', label: '11:00 PM' },
  { value: '23:30', label: '11:30 PM' },
] as const

// Helper function to parse existing opening hours text into structured format
export function parseOpeningHours(
  hoursText: string
): { open: string; close: string } | null {
  if (!hoursText || hoursText.toLowerCase().includes('closed')) {
    return null
  }

  // Try to parse formats like "9:00 AM - 5:00 PM" or "09:00 - 17:00"
  const timeRegex =
    /(\d{1,2}):(\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i
  const match = hoursText.match(timeRegex)

  if (match) {
    const [, openHour, openMin, openAmPm, closeHour, closeMin, closeAmPm] =
      match

    // Convert to 24-hour format
    let openTime = `${openHour.padStart(2, '0')}:${openMin}`
    let closeTime = `${closeHour.padStart(2, '0')}:${closeMin}`

    // Handle AM/PM conversion
    if (openAmPm) {
      const openHourNum = parseInt(openHour)
      if (openAmPm.toLowerCase() === 'pm' && openHourNum !== 12) {
        openTime = `${(openHourNum + 12).toString().padStart(2, '0')}:${openMin}`
      } else if (openAmPm.toLowerCase() === 'am' && openHourNum === 12) {
        openTime = `00:${openMin}`
      }
    }

    if (closeAmPm) {
      const closeHourNum = parseInt(closeHour)
      if (closeAmPm.toLowerCase() === 'pm' && closeHourNum !== 12) {
        closeTime = `${(closeHourNum + 12).toString().padStart(2, '0')}:${closeMin}`
      } else if (closeAmPm.toLowerCase() === 'am' && closeHourNum === 12) {
        closeTime = `00:${closeMin}`
      }
    }

    return { open: openTime, close: closeTime }
  }

  return null
}

// Helper function to format opening hours for display
export function formatOpeningHours(open: string, close: string): string {
  const openOption = TIME_OPTIONS.find((opt) => opt.value === open)
  const closeOption = TIME_OPTIONS.find((opt) => opt.value === close)

  if (openOption && closeOption) {
    return `${openOption.label} - ${closeOption.label}`
  }

  return `${open} - ${close}`
}
