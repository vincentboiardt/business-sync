import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { BusinessProfileFormData } from '~/types/business'
import { FormSection, FormField, Input, Textarea } from '../form/index'

interface BusinessProfileFieldsProps {
  register: UseFormRegister<BusinessProfileFormData>
  errors: FieldErrors<BusinessProfileFormData>
}

export function BusinessProfileFields({
  register,
  errors,
}: BusinessProfileFieldsProps) {
  return (
    <FormSection title="Basic Information">
      <FormField error={errors.business_name?.message}>
        <Input
          label="Business Name"
          {...register('business_name')}
          error={!!errors.business_name}
          required
          placeholder="Enter your business name"
        />
      </FormField>

      <FormField error={errors.address?.message}>
        <Textarea
          label="Address"
          {...register('address')}
          error={!!errors.address}
          rows={3}
          placeholder="Enter your business address"
        />
      </FormField>

      <FormField error={errors.phone?.message}>
        <Input
          label="Phone Number"
          type="tel"
          {...register('phone')}
          error={!!errors.phone}
          placeholder="Enter your phone number"
        />
      </FormField>

      <FormField error={errors.website?.message}>
        <Input
          label="Website"
          type="url"
          {...register('website')}
          error={!!errors.website}
          placeholder="https://your-website.com"
        />
      </FormField>
    </FormSection>
  )
}
