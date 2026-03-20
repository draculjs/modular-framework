
import { fileGlobalMetrics, fileUserMetrics, almacenamientoPorUsuario, cantidadArchivosPorUsuario } from '../../services/FileMetricsService'
import { AuthenticationError, ForbiddenError } from "apollo-server-errors";
import { DefaultLogger as winston } from "@dracul/logger-backend";

import {
    FILE_SHOW_ALL,
} from "../../permissions/File";

export default {

    Query: {
        fileUserMetrics: (_, { }, { user, rbac }) => {
            const startTime = Date.now();
            const userId = user?.id || 'unknown';
            
            winston.debug(`FileMetricsResolvers.fileUserMetrics: userId='${userId}'`);
            
            if (!user) {
                winston.warn(`FileMetricsResolvers.fileUserMetrics: unauthenticated access attempt`);
                throw new AuthenticationError("Unauthenticated");
            }
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL)) {
                winston.warn(`FileMetricsResolvers.fileUserMetrics: forbidden - userId='${userId}' lacks FILE_SHOW_ALL`);
                throw new ForbiddenError("Not Authorized");
            }

            const result = fileUserMetrics();
            
            result.then((metrics) => {
                winston.info(`FileMetricsResolvers.fileUserMetrics: success - userId='${userId}', duration=${Date.now() - startTime}ms`);
            }).catch((error) => {
                winston.error(`FileMetricsResolvers.fileUserMetrics: error - userId='${userId}', error='${error.message}'`);
            });

            return result;
        },
        almacenamientoPorUsuario: (_, { }, { user, rbac }) => {
            const startTime = Date.now();
            const userId = user?.id || 'unknown';
            
            winston.debug(`FileMetricsResolvers.almacenamientoPorUsuario: userId='${userId}'`);
            
            if (!user) {
                winston.warn(`FileMetricsResolvers.almacenamientoPorUsuario: unauthenticated access attempt`);
                throw new AuthenticationError("Unauthenticated");
            }
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL)) {
                winston.warn(`FileMetricsResolvers.almacenamientoPorUsuario: forbidden - userId='${userId}' lacks FILE_SHOW_ALL`);
                throw new ForbiddenError("Not Authorized");
            }

            const result = almacenamientoPorUsuario();
            
            result.then((metrics) => {
                winston.info(`FileMetricsResolvers.almacenamientoPorUsuario: success - userId='${userId}', userCount=${metrics?.labels?.length || 0}, duration=${Date.now() - startTime}ms`);
            }).catch((error) => {
                winston.error(`FileMetricsResolvers.almacenamientoPorUsuario: error - userId='${userId}', error='${error.message}'`);
            });

            return result;
        },
        cantidadArchivosPorUsuario: (_, { }, { user, rbac }) => {
            const startTime = Date.now();
            const userId = user?.id || 'unknown';
            
            winston.debug(`FileMetricsResolvers.cantidadArchivosPorUsuario: userId='${userId}'`);
            
            if (!user) {
                winston.warn(`FileMetricsResolvers.cantidadArchivosPorUsuario: unauthenticated access attempt`);
                throw new AuthenticationError("Unauthenticated");
            }
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL)) {
                winston.warn(`FileMetricsResolvers.cantidadArchivosPorUsuario: forbidden - userId='${userId}' lacks FILE_SHOW_ALL`);
                throw new ForbiddenError("Not Authorized");
            }

            const result = cantidadArchivosPorUsuario();
            
            result.then((metrics) => {
                winston.info(`FileMetricsResolvers.cantidadArchivosPorUsuario: success - userId='${userId}', userCount=${metrics?.labels?.length || 0}, duration=${Date.now() - startTime}ms`);
            }).catch((error) => {
                winston.error(`FileMetricsResolvers.cantidadArchivosPorUsuario: error - userId='${userId}', error='${error.message}'`);
            });

            return result;
        },
        fileGlobalMetrics: (_, { }, { user, rbac }) => {
            const startTime = Date.now();
            const userId = user?.id || 'unknown';
            
            winston.debug(`FileMetricsResolvers.fileGlobalMetrics: userId='${userId}'`);
            
            if (!user) {
                winston.warn(`FileMetricsResolvers.fileGlobalMetrics: unauthenticated access attempt`);
                throw new AuthenticationError("Unauthenticated");
            }
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL)) {
                winston.warn(`FileMetricsResolvers.fileGlobalMetrics: forbidden - userId='${userId}' lacks FILE_SHOW_ALL`);
                throw new ForbiddenError("Not Authorized");
            }

            const result = fileGlobalMetrics();
            
            result.then((metrics) => {
                winston.info(`FileMetricsResolvers.fileGlobalMetrics: success - userId='${userId}', totalFiles=${metrics?.count || 0}, totalSize=${metrics?.weight || 0}, duration=${Date.now() - startTime}ms`);
            }).catch((error) => {
                winston.error(`FileMetricsResolvers.fileGlobalMetrics: error - userId='${userId}', error='${error.message}'`);
            });

            return result;
        },
    }
}
