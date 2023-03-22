import React from 'react';
import {TabContainer, TabItem, TabTitle} from './styles';

export const CONST_EVENT_TABS = {
  WEEKLY: 'Weekly hours',
  DATE_OVERRIDE: 'Date overrides',
};

export const AvailabilityTabComponent = props => {
  const {selectedTab, setSelectTab} = props;

  return (
    <TabContainer>
      {Object.values(CONST_EVENT_TABS).map(title => (
        <TabItem
          isSelected={selectedTab === title}
          onPress={() => setSelectTab(() => title)}>
          <TabTitle isSelected={selectedTab === title}>{title}</TabTitle>
        </TabItem>
      ))}
    </TabContainer>
  );
};
