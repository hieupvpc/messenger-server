export const convertHelper = () => {
  const removeAccents = (string: string) =>
    string
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()

  return {
    removeAccents,
  }
}
