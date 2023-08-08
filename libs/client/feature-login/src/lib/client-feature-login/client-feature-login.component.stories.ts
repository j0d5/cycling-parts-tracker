import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Meta,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { ClientFeatureLoginComponent } from './client-feature-login.component';
export default {
  title: 'Login Component',
  component: ClientFeatureLoginComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
    }),
    componentWrapperDecorator(
      (s) => `
      <div style="width: 50vw; height: 100vh">${s}</div>
    `
    ),
  ],
  argTypes: {
    submitForm: {
      action: 'submitForm',
    },
  },
} as Meta<ClientFeatureLoginComponent>;

export const Primary = {
  render: (args: ClientFeatureLoginComponent) => ({
    props: args,
  }),
  args: {},
};
