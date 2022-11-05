import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import SidebarText from './SidebarText';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { defaultQueryConfig } from '../queries/config';
import { getPortfoliosQuery, PORTFOLIO_QUERY_KEY } from '../queries/portfolio';
import CenteredSpinner from '../components/CenteredSpinner';
import { MdAdd } from 'react-icons/md';

const PortfolioDropdownRouteButton = (isActive: boolean, route: RouteType) => {
  const history = useHistory();
  const activeIcon = useColorModeValue('brand.500', 'white');
  const textColor = useColorModeValue('secondaryGrey.500', 'white');

  const { data, isLoading } = useQuery([PORTFOLIO_QUERY_KEY], getPortfoliosQuery, {
    ...defaultQueryConfig,
  });

  return (
    <Accordion me='auto' className='accordion-sidebar' allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton className='accordion-button-sidebar'>
            <Box
              style={{ height: route.icon ? route.icon.props.height : 20 }}
              color={isActive ? activeIcon : textColor}
              me='18px'
            >
              {route.icon}
            </Box>
            <SidebarText route={route} />
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <>
          {isLoading ? (
            <CenteredSpinner />
          ) : data.data ? (
            data.data
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((portfolio, index) => (
                <AccordionPanel
                  key={index}
                  as={AccordionButton}
                  onClick={() => history.push(route.layout + '/edit-portfolio', { portfolio })}
                  pb={4}
                >
                  {portfolio.name}
                </AccordionPanel>
              ))
          ) : null}
        </>
        <AccordionPanel as={AccordionButton} pb={4} onClick={() => history.push(route.layout + route.path)}>
          <HStack align='center'>
            <Icon as={MdAdd} />
            <Text>Add Portfolio</Text>
          </HStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default PortfolioDropdownRouteButton;
