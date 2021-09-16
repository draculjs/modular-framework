import QueueStatsPage from "./pages/QueueStatsPage/QueueStatsPage";
import QueueManagementPage from "./pages/QueueManagementPage";
import QueueStatsTable from "./components/QueueStatsTable";
import routes from './routes'
import i18nMessages from './i18n/messages'
import queueStatsProvider from "./providers/QueueStatsProvider";
import QueueProvider from "./providers/QueueProvider";

export {
    //Pages
    QueueStatsPage,
    QueueManagementPage,

    //Components
    QueueStatsTable,

    //routes
    routes,

    //I18n
    i18nMessages,

    //Providers
    queueStatsProvider,
    QueueProvider
}
