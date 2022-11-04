import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Button, HStack, useToast, VStack } from '@chakra-ui/react';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { UpdateInvestmentDto } from '@shared/investment';
import { CreatePortfolioDto, GetPortfolioDto, UpdatePortfolioDto } from '@shared/portfolio';
import FormikInput from '../../components/form/FormikInput';
import { showToast } from '../../utils/toast';
import { createPortfolioMutation, PORTFOLIO_QUERY_KEY, updatePortfolioMutation } from '../../queries/portfolio';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().nullable().optional(),
});

const PortfolioForm = ({ editPortfolio }: { editPortfolio: GetPortfolioDto | null }) => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const showSuccessToast = () => {
    showToast(toast, `Successfully ${editPortfolio ? 'updated' : 'created'} portfolio`);
  };

  const mutationCreate = useMutation(createPortfolioMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries([PORTFOLIO_QUERY_KEY]); // TODO: Update porfolio
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const mutationUpdate = useMutation(updatePortfolioMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries([PORTFOLIO_QUERY_KEY]); // TODO: Update porfolio
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const formik = useFormik({
    initialValues: {
      name: editPortfolio ? editPortfolio.name : '',
      description: editPortfolio ? editPortfolio.description : '',
    },
    validationSchema: validationSchema,
    onSubmit: (values: CreatePortfolioDto | UpdatePortfolioDto) => {
      if (editPortfolio) {
        const v = values as UpdateInvestmentDto;
        v.id = editPortfolio.id;
        return mutationUpdate.mutateAsync(v);
      } else {
        return mutationCreate.mutateAsync(values as CreatePortfolioDto);
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: editPortfolio ? editPortfolio.name : '',
      description: editPortfolio ? editPortfolio.description : '',
    });
  }, [editPortfolio, formik.setValues]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4} align='flex-start'>
        <HStack width='50%' spacing='10px'>
          <FormikInput formik={formik} valueKey='name' label='Name' tooltip='Name of the portfolio' required />
        </HStack>
        <HStack width='50%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='description'
            label='Description'
            tooltip='Description of the portfolio'
          />
        </HStack>

        <HStack justify='end' w='100%'>
          <Button onClick={() => history.push('/dashboard')} colorScheme='grey' mr={3}>
            Close
          </Button>
          <Button isLoading={formik.isSubmitting} type='submit' colorScheme='blue' mr={3}>
            {editPortfolio ? 'Update' : 'Add'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default PortfolioForm;
