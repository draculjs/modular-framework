const fs = require('fs');
const path = require('path');
const {
  test
} = require('@playwright/test');
const root = path.resolve(__dirname, '../../../..');
const compiler = require('vue-template-compiler');
test('Vue 2 editors sanitize, format, validate, inherit readonly and reset', async ({
  page
}) => {
  page.on('pageerror', e => {
    throw e;
  });
  await page.setContent('<div id="app"></div>');
  for (const path of ['vue/dist/vue.js', 'vuetify/dist/vuetify.js', 'dompurify/dist/purify.js', 'marked/lib/marked.umd.js']) await page.addScriptTag({
    path: root + '/node_modules/' + path
  });
  for (const name of ['HtmlEditor', 'MarkdownEditor']) {
    const s = compiler.parseComponent(fs.readFileSync(`${root}/packages/common/common-frontend/src/components/${name}/${name}.vue`, 'utf8'));
    const js = s.script.content.replace(/import .* from ['"]vue['"]/, 'const {computed, ref, watch, nextTick, inject, onMounted, onBeforeUnmount, getCurrentInstance} = Vue').replace(/import DOMPurify from ['"]dompurify['"]/, '').replace(/import \{\s*marked\s*\} from ['"]marked['"]/, '').replace('export default', `window.${name} =`);
    await page.addScriptTag({
      content: `{${js}\nwindow.${name}.template = ${JSON.stringify(s.template.content)};}`
    });
  }
  await page.evaluate(() => {
    Vue.use(Vuetify);
    window.vm = new Vue({
      el: '#app',
      vuetify: new Vuetify(),
      components: {
        HtmlEditor,
        MarkdownEditor
      },
      data: () => ({
        html: '',
        md: '',
        blocked: false
      }),
      template: '<v-app><v-form ref="form" :readonly="blocked"><html-editor ref="html" v-model="html" label="HTML" clearable :rules="[v => !!v || \'Obligatorio\']"/><markdown-editor ref="md" v-model="md" label="Markdown" :rules="[v => !!v || \'Obligatorio\']"/></v-form></v-app>'
    });
  });
  const assert = (value, msg) => {
    if (!value) throw Error(msg);
  };
  assert((await page.evaluate(() => vm.$refs.form.validate())) === false, 'required validation');
  await page.locator('[contenteditable]').evaluate(el => {
    el.innerHTML = '<b onclick="alert(1)">Hola</b><script>bad()</script>';
    el.dispatchEvent(new Event('input', {
      bubbles: true
    }));
  });
  assert((await page.evaluate(() => vm.html)) === '<b>Hola</b>', 'sanitized input');
  await page.locator('textarea').fill('mundo');
  await page.locator('textarea').evaluate(el => el.setSelectionRange(0, 5));
  await page.locator('.markdown-editor button[aria-label="Negrita"]').click();
  assert((await page.evaluate(() => vm.md)) === '**mundo**', 'markdown formatting');
  await page.getByText('Vista previa', {
    exact: true
  }).click();
  assert((await page.locator('.markdown-editor__preview strong').textContent()) === 'mundo', 'preview');
  assert((await page.evaluate(() => vm.$refs.form.validate())) === true, 'valid form');
  await page.evaluate(() => {
    vm.md = '<script>bad()</script><img src=x onerror="bad()">';
    vm.blocked = true;
  });
  await page.waitForTimeout(100);
  assert((await page.locator('.markdown-editor__preview script').count()) === 0, 'preview scripts removed');
  assert((await page.locator('.markdown-editor__preview [onerror]').count()) === 0, 'preview events removed');
  assert((await page.locator('[contenteditable]').getAttribute('contenteditable')) === 'false', 'inherited readonly');
  await page.evaluate(() => {
    vm.$refs.html.clear();
    vm.$refs.md.insert('bold');
  });
  assert((await page.evaluate(() => vm.html)) === '<b>Hola</b>', 'readonly prevents clear');
  await page.evaluate(async () => {
    vm.blocked = false;
    await Vue.nextTick();
    vm.$refs.form.reset();
  });
  await page.waitForTimeout(100);
  assert((await page.evaluate(() => vm.html)) === '', 'form resets html');
  assert((await page.evaluate(() => vm.md)) === '', 'form resets markdown');
});
