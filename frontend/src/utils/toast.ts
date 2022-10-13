export const showToast = (
  toast: any,
  title: string,
  status: string = 'success'
) => {
  toast({
    title: title,
    status: status,
    duration: 4500,
    position: 'bottom-right',
    isClosable: true,
  });
};
