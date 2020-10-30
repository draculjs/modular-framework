import QueueStatsTable from './QueueStatsTable.vue';
import i18n from "../i18n/index";

export default {
  title: 'Components/QueueStatsTable',
  component: QueueStatsTable,
  argTypes: {
    queueStats: [
      {topic: 'ImportCSV', added: 5, gotten: 2, failed: 0, done: 1 },
      {topic: 'BatchCampaign', added: 8, gotten: 7, failed: 2, done: 5 }
    ],

  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QueueStatsTable },
  template: '<queue-stats-table  v-bind="$props" />',
  i18n
});

export const Primary = Template.bind({});
Primary.args = {
  queueStats: [
    {topic: 'ImportCSV', added: 5, gotten: 2, failed: 0, done: 1 },
    {topic: 'BatchCampaign', added: 8, gotten: 7, failed: 2, done: 5 }
  ],
};

