import React from "react";
import { useFormik } from "formik";
import { Button, FormControl, FormLabel, HStack, Input, VStack, FormHelperText, Textarea } from "@chakra-ui/react";

const InvestmentForm = (props: any) => {
  const formik = useFormik({
    initialValues: {
      buyDate: "",
      sellDate: "",
      buyPrice: "0",
      sellPrice: "0",
      buyNote: "",
      sellNote: "",
      name: "BTC",
      fees: "0",
      investedAmount: "0",
      holdings: "0",
      locationName: "Binance",
      primaryTag: "Crypto",
      secondaryTag: "Bitcoin",
      priceLink: "https://www.binance.com/en/trade/BTC_USDT",
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  const addInput = (valueKey: string, label: string, type = "text") => {
    let input: JSX.Element;

    if (type === "textarea") {
      input = <Textarea
        id="sellNote"
        name="sellNote"
        value={formik.values.sellNote}
        onChange={formik.handleChange}
        size='sm'
      />
    } else {
      input = <Input
        id={valueKey}
        name={valueKey}
        type={type}
        variant="filled"
        onChange={formik.handleChange}
        // @ts-ignore
        value={formik.values[valueKey]}
      />
    }

    return (
      <FormControl>
        <FormLabel htmlFor={valueKey}>{label}</FormLabel>
        { input }
      </FormControl>
    )
  }

  return <form onSubmit={formik.handleSubmit}>
    <VStack spacing={4} align="flex-start">
      { addInput("name", "Name") }
      { addInput("investedAmount", "Invested Amount") }
      { addInput("holdings", "Holdings") }
      { addInput("buyPrice", "Buy Price") }
      { addInput("buyDate", "Buy Date", "date") }
      { addInput("sellPrice", "Sell Price") }
      { addInput("sellDate", "Sell Date", "date") }
      { addInput("fees", "Fees") }
      { addInput("priceLink", "Price Link") }
      { addInput("locationName", "Location Name") }
      { addInput("primaryTag", "Primary Tag") }
      { addInput("secondaryTag", "Secondary Tag") }
      { addInput("buyNote", "Buy Note", "textarea") }
      { addInput("sellNote", "Sell Note", "textarea") }

      <HStack justify="end" w="100%">
        <Button colorScheme="blue" mr={3} onClick={props.onClose}>
          Close
        </Button>
        <Button colorScheme="blue" mr={3} onClick={props.onAdd}>
          Add
        </Button>
      </HStack>
    </VStack>
  </form>;
};

export default InvestmentForm;
