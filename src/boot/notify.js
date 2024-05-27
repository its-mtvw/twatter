import { Notify } from "quasar";

export { Notify };

export default ({ app }) => {
  app.config.globalProperties.$q.notify = Notify.create;
};