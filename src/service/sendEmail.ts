type EmailParams = {
  recipient: string;
  subject: string;
  message: string;
};

export const sendEmail = async (params: EmailParams) => {
  console.log(params);
};
