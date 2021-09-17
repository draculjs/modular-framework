import QueueStatsPage from "./pages/QueueStatsPage/QueueStatsPage";
import JobsPage from "./pages/JobsPage";
import JobPage from "./pages/JobPage";
import QueueStatsTable from "./components/QueueStatsTable";
import routes from './routes'
import i18nMessages from './i18n/messages'
import queueStatsProvider from "./providers/QueueStatsProvider";
import QueueProvider from "./providers/QueueProvider";

export {
    //Pages
    QueueStatsPage,
    JobsPage,
    JobPage,

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
