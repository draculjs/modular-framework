import QueueList from './QueueList';
export default {
  title: 'Components/QueueList',
  component: QueueList,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QueueList },
  template:
    '<queue-list  />',
});

export const Main = Template.bind({});
Main.args = {};
