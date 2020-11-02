interface FieldError {
  field: string;
  message: string;
}

export const mapErrors = (errors: FieldError[]) => {
  return errors.reduce<{}>((prev, curr) => {
    return {
      ...prev,
      [curr.field]: curr.message,
    };
  }, {});
};
