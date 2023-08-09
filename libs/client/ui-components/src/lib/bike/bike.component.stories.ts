import {
  Meta,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { BikeComponent } from './bike.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { randBoolean, randProduct, randProductName } from '@ngneat/falso';

const randBike = () => {
  const { id, title } = randProduct();
  return {
    id,
    manufacturer: title,
    model: randProductName(),
    archived: randBoolean(),
  };
};

export default {
  title: 'BikeComponent',
  component: BikeComponent,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule],
    }),
    componentWrapperDecorator(
      (s) => `

    <div style="width: 500px; height: 280px; position: relative; padding: 2rem">${s}</div>`
    ),
  ],
  argTypes: {
    triggerDelete: {
      action: 'delete',
    },
    triggerEdit: {
      action: 'edit',
    },
    triggerToggleArchive: {
      action: 'toggleArchive',
    },
  },
} as Meta<BikeComponent>;

export const Primary = {
  render: (args: BikeComponent) => ({
    props: args,
  }),
  args: {
    bike: randBike(),
  },
};
