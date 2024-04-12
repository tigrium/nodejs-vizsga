type EmailParams = {
  recipient: string;
  subject: string;
  message: string;
};

export const sendEmail = (params: EmailParams) => {
  console.log(params);
};
