import React from 'react';
import { GetUserDto, UpdateUserDto } from '@shared/user';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { CryptoAddressType } from '../../utils/address';
import { setupYup } from '../../utils/yup';
import FormikInput from '../../components/form/FormikInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_USER, updateUserMutation } from '../../queries/user';

setupYup();
const validationSchema = Yup.object().shape({
  erc20Address: Yup.string().cryptoAddress(CryptoAddressType.ERC20, 'This is not an ERC20 Address').optional(),
  btcAddress: Yup.string().cryptoAddress(CryptoAddressType.BTC, 'This is not a BTC Address').optional(),
  email: Yup.string().email().required('Email is required'),
});

const UserForm = ({ user }: { user: GetUserDto }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(updateUserMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_USER]);
    },
  });

  const formik = useFormik<GetUserDto>({
    initialValues: {
      email: user.email,
      erc20Address: user.erc20Address || '',
      btcAddress: user.btcAddress || '',
    },
    validationSchema: validationSchema,
    onSubmit: (user: GetUserDto, actions) => {
      mutation.mutateAsync(user as UpdateUserDto).then(() => {
        actions.setSubmitting(false);
        actions.resetForm({ values: user });
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack width='50%' spacing={4} align='flex-start'>
        <HStack width='100%' spacing='10px'>
          <FormikInput valueKey='email' label='Email' tooltip='Your email address' formik={formik} />
        </HStack>
        <HStack width='100%' spacing='10px'>
          <FormikInput valueKey='erc20Address' label='ERC20 Address' tooltip='Your ERC20 Address' formik={formik} />
        </HStack>
        <HStack width='100%' spacing='10px'>
          <FormikInput valueKey='btcAddress' label='BTC Address' tooltip='Your BTC Address' formik={formik} />
        </HStack>
        {formik.dirty === true && (
          <HStack justify='end' w='100%'>
            <Button isLoading={formik.isSubmitting} type='submit' colorScheme='blue' mr={3}>
              Update
            </Button>
          </HStack>
        )}
      </VStack>
    </form>
  );
};

export default UserForm;
