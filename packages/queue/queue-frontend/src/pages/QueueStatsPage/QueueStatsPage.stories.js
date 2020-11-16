import QueueStatsPage from './QueueStatsPage';
export default {
  title: 'Pages/QueueStatsPage',
  component: QueueStatsPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QueueStatsPage },
  template:
    '<queue-stats-page  />',
});

export const Main = Template.bind({});
Main.args = {};
