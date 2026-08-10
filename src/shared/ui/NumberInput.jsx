function formatInputNumber(value) {
  if (value === '' || value === null || value === undefined) return ''

  const [integer = '', fraction] = String(value).split('.')
  const groupedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return fraction === undefined
    ? groupedInteger
    : `${groupedInteger}.${fraction}`
}

export default function NumberInput({
  value,
  onValueChange,
  allowDecimal = true,
  maxFractionDigits = 2,
  ...props
}) {
  function handleChange(event) {
    const rawValue = event.target.value.replaceAll(',', '').trim()
    const pattern = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/

    if (!pattern.test(rawValue)) return

    const fraction = rawValue.split('.')[1]
    if (fraction && fraction.length > maxFractionDigits) return

    onValueChange(rawValue)
  }

  return (
    <input
      {...props}
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      onChange={handleChange}
      type="text"
      value={formatInputNumber(value)}
    />
  )
}
