import { DAYS_OF_WEEK, TIME_OPTIONS, parseOpeningHours } from '~/types/business'
import { FormSection } from '../form/FormSection'
import { Checkbox } from '../form/Checkbox'
import { Select } from '../form/Select'

interface OpeningHoursFieldProps {
  openingHours: Record<string, string>
  onTimeChange: (
    day: string,
    timeType: 'open' | 'close',
    timeValue: string
  ) => void
  onClosedToggle: (day: string, isClosed: boolean) => void
  error?: string
}

export function OpeningHoursField({
  openingHours,
  onTimeChange,
  onClosedToggle,
  error,
}: OpeningHoursFieldProps) {
  return (
    <FormSection
      title="Opening Hours"
      description="Set your business operating hours. Toggle closed for days you're not open."
    >
      <div className="space-y-4">
        {DAYS_OF_WEEK.map((day) => {
          const currentHours = openingHours?.[day] || ''
          const parsedHours = parseOpeningHours(currentHours)
          const isClosed =
            !parsedHours || currentHours.toLowerCase().includes('closed')

          return (
            <div key={day} className="flex items-center space-x-3">
              <div className="w-24 text-sm font-medium text-gray-700 capitalize">
                {day}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  label="Closed"
                  checked={isClosed}
                  onChange={(e) => onClosedToggle(day, e.target.checked)}
                  className="text-brand focus:ring-brand"
                />

                {!isClosed && (
                  <>
                    <Select
                      options={TIME_OPTIONS}
                      value={parsedHours?.open || '09:00'}
                      onChange={(e) =>
                        onTimeChange(day, 'open', e.target.value)
                      }
                      className="min-w-0"
                    />

                    <span className="text-sm text-gray-500">to</span>

                    <Select
                      options={TIME_OPTIONS}
                      value={parsedHours?.close || '17:00'}
                      onChange={(e) =>
                        onTimeChange(day, 'close', e.target.value)
                      }
                      className="min-w-0"
                    />
                  </>
                )}
              </div>
            </div>
          )
        })}
        {error && (
          <p className="text-sm text-red-600">
            {typeof error === 'string' ? error : 'Invalid opening hours format'}
          </p>
        )}
      </div>
    </FormSection>
  )
}
