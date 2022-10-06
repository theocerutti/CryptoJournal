import React, { useEffect } from 'react';
import {
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { MdFilterAlt } from 'react-icons/md';

export function MultiCheckBoxColumnFilter({
  column: { setFilter, preFilteredRows, id },
}: {
  column: {
    setFilter: any;
    preFilteredRows: any;
    id: string;
  };
}) {
  const options = React.useMemo(() => {
    let counts: any = {};
    preFilteredRows.forEach((x: any) => {
      x = x.values[id].toString();

      counts[x] = (counts[x] || 0) + 1;
    });
    return counts;
  }, [id, preFilteredRows]);

  const [checked, setChecked] = React.useState([]);

  const onChange = (e: any) => {
    const t = e.target.name.toString();

    if (checked && checked.includes(t)) {
      setFilter(checked.filter((v) => v !== t));
      // setChecked((p) => p.filter((v) => v !== t));
      setChecked((prevChecked) => {
        if (prevChecked.length === 1) return Object.keys(options);
        return prevChecked.filter((v) => v !== t);
      });
    } else {
      setFilter([...checked, t]);
      setChecked((prevChecked) => [...prevChecked, t]);
    }
  };

  useEffect(() => {
    if (Object.keys(options).length === checked.length) setChecked([]);
  }, [checked.length, options]);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<MdFilterAlt />}
        variant='ghost'
      />
      <MenuList>
        <MenuItem>
          <Checkbox
            disabled={checked.length === 0}
            isChecked={checked.length === 0}
            onChange={(e) => {
              setChecked(e.target.checked ? Object.keys(options) : []);
              setFilter([]);
            }}
          >
            Show All
          </Checkbox>
        </MenuItem>

        {Object.entries(options).map(([option, count], i) => {
          return (
            <MenuItem key={i}>
              <Checkbox
                name={option}
                id={option}
                isChecked={checked.includes(option)}
                onChange={onChange}
              >
                {option}
              </Checkbox>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

export const multiSelectFilterType = (
  rows: any,
  id: string,
  filterValues: string
) => {
  if (filterValues.length === 0) return rows;
  return rows.filter((r: any) => filterValues.includes(r.values[id]));
};
