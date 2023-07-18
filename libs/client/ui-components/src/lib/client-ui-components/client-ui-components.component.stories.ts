import { Meta } from '@storybook/angular';
import { ClientUiComponentsComponent } from './client-ui-components.component';

export default {
  title: 'ClientUiComponentsComponent',
  component: ClientUiComponentsComponent,
} as Meta<ClientUiComponentsComponent>;

export const Primary = {
  render: (args: ClientUiComponentsComponent) => ({
    props: args,
  }),
  args: {},
};
