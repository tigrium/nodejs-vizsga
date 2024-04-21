type EmailParams = {
  recipient: string;
  subject: string;
  message: string;
};

export const sendEmail = async (params: EmailParams) => {
  console.log('Címzett:', params.recipient);
  console.log('Tárgy:', params.subject);
  console.log('Üzenet:');
  console.log(params.message);
};
