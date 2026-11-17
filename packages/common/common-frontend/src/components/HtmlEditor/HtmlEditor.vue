<template>
  <v-input
    ref="inputRef"
    class="html-editor"
    :value="html"
    :dense="dense"
    :name="name"
    :label="label"
    :rules="rules"
    :readonly="readonly"
    :disabled="disabled"
    :error-messages="errorMessages"
    :hint="hint"
    :persistent-hint="persistentHint"
    :hide-details="hideDetails"
    :id="`${editorId}-validation`"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    @input="onValidationModelUpdate"
  >
    <template #default>
      <div
        class="html-editor__field"
        :class="[{ 'html-editor__field--outlined': outlined, 'html-editor__field--filled': filled, 'html-editor__field--solo': solo }, {'html-editor__field--error': hasError,
          'html-editor__field--focused': focused, 'html-editor__field--disabled': isDisabled}]"
      >
        <label v-if="label" :id="`${editorId}-label`" :for="editorId" class="html-editor__label" :class="{'html-editor__label--single': singleLine}">
          {{ label }}
        </label>
        <div class="html-editor__toolbar" role="toolbar" aria-label="Formato de texto" @pointerdown.capture="saveEditorSelection" @focusin="saveEditorSelection">
          <v-btn
            v-for="item in commands" :key="item.command"
            icon :title="item.title" :aria-label="item.title"
            text small :disabled="isDisabled || isReadonly"
            @mousedown.prevent @click="applyFormat(item.command, item.value)"
          ><v-icon small>{{ item.icon }}</v-icon></v-btn>
          <select aria-label="Fuente" title="Fuente" :disabled="isDisabled || isReadonly" @change="applyFormat('fontName', $event.target.value)">
            <option value="" disabled selected>Fuente</option>
            <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
          </select>
          <select aria-label="Tamaño de fuente" title="Tamaño de fuente" :disabled="isDisabled || isReadonly" @change="applyFormat('fontSize', $event.target.value)">
            <option value="" disabled selected>Tamaño</option>
            <option v-for="size in sizes" :key="size.value" :value="size.value">{{ size.title }}</option>
          </select>
          <input type="color" aria-label="Color de texto" title="Color de texto" :disabled="isDisabled || isReadonly" @change="applyFormat('foreColor', $event.target.value)">
        </div>
        <div class="html-editor__content">
          <v-icon v-if="prependInnerIcon"  class="html-editor__inner-icon">{{ prependInnerIcon }}</v-icon>
          <div
            :id="editorId" ref="editorRef" class="html-editor__body"
            role="textbox" aria-multiline="true"
            :aria-labelledby="label ? `${editorId}-label` : undefined"
            :aria-label="label ? undefined : (placeholder || 'Editor de texto')"
            :aria-describedby="`${editorId}-validation-messages`"
            :aria-invalid="hasError"
            :aria-readonly="isReadonly" :aria-disabled="isDisabled"
            :aria-placeholder="placeholder"
            :contenteditable="!isDisabled && !isReadonly"
            :tabindex="isDisabled ? -1 : 0"
            :data-placeholder="persistentPlaceholder || focused || !label ? placeholder : undefined"
            :style="{minHeight}"
            @focus="focused = true" @blur="onBlur"
            @input="onInput" @paste="onPaste" @drop.prevent
            @beforeinput="(isDisabled || isReadonly) && $event.preventDefault()"
          />
          <v-btn v-if="clearable && html && !isReadonly" icon title="Borrar contenido" aria-label="Borrar contenido" text small :disabled="isDisabled" @mousedown.prevent @click="clear"><v-icon small>{{ clearIcon }}</v-icon></v-btn>
          <v-icon v-if="appendInnerIcon"  class="html-editor__inner-icon">{{ appendInnerIcon }}</v-icon>
        </div>
        <input v-if="name" type="hidden" :name="name" :value="html" :disabled="isDisabled">
      </div>
    </template>
  </v-input>
</template>

<script>
import { computed, ref, watch, inject, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import DOMPurify from 'dompurify';
export default {
  name: "HtmlEditor",
  props: {
    value: {
      type: String,
      default: ''
    },
    label: String,
    name: String,
    rows: {
      type: [Number, String],
      default: 5
    },
    readonly: {
      type: Boolean,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: undefined
    },
    rules: {
      type: Array,
      default: () => []
    },
    errorMessages: {
      type: [String, Array],
      default: () => []
    },
    hint: String,
    persistentHint: Boolean,
    placeholder: String,
    persistentPlaceholder: Boolean,
    hideDetails: [Boolean, String],
    clearable: Boolean,
    singleLine: Boolean,
    dense: Boolean,
    outlined: {
      type: Boolean,
      default: true
    },
    filled: Boolean,
    solo: Boolean,
    prependIcon: String,
    appendIcon: String,
    prependInnerIcon: String,
    appendInnerIcon: String,
    clearIcon: {
      type: String,
      default: 'close'
    }
  },
  setup(props, {
    emit
  }) {
    const form = inject('form', null);
    const isReadonly = computed(() => props.readonly == null ? !!(form && form.readonly) : props.readonly);
    const isDisabled = computed(() => props.disabled == null ? !!(form && form.disabled) : props.disabled);
    const editorRef = ref(null);
    const inputRef = ref(null);
    const focused = ref(false);
    const html = ref('');
    let savedSelection = null;
    const minHeight = computed(() => `${Math.max(1, Number(props.rows) || 5) * 1.5}em`);
    const commands = [{
      command: 'undo',
      title: 'Deshacer',
      icon: 'undo'
    }, {
      command: 'redo',
      title: 'Rehacer',
      icon: 'redo'
    }, {
      command: 'bold',
      title: 'Negrita',
      icon: 'format_bold'
    }, {
      command: 'italic',
      title: 'Cursiva',
      icon: 'format_italic'
    }, {
      command: 'underline',
      title: 'Subrayado',
      icon: 'format_underlined'
    }, {
      command: 'strikeThrough',
      title: 'Tachado',
      icon: 'strikethrough_s'
    }, {
      command: 'insertUnorderedList',
      title: 'Lista con viñetas',
      icon: 'format_list_bulleted'
    }, {
      command: 'insertOrderedList',
      title: 'Lista numerada',
      icon: 'format_list_numbered'
    }, {
      command: 'formatBlock',
      value: 'blockquote',
      title: 'Cita',
      icon: 'format_quote'
    }, {
      command: 'outdent',
      title: 'Reducir sangría',
      icon: 'format_indent_decrease'
    }, {
      command: 'indent',
      title: 'Aumentar sangría',
      icon: 'format_indent_increase'
    }, {
      command: 'justifyLeft',
      title: 'Alinear a la izquierda',
      icon: 'format_align_left'
    }, {
      command: 'justifyCenter',
      title: 'Centrar',
      icon: 'format_align_center'
    }, {
      command: 'justifyRight',
      title: 'Alinear a la derecha',
      icon: 'format_align_right'
    }, {
      command: 'justifyFull',
      title: 'Justificar',
      icon: 'format_align_justify'
    }, {
      command: 'removeFormat',
      title: 'Limpiar formato',
      icon: 'format_clear'
    }];
    const fonts = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New'];
    const sizes = [{
      value: '2',
      title: 'Pequeño'
    }, {
      value: '3',
      title: 'Normal'
    }, {
      value: '5',
      title: 'Grande'
    }, {
      value: '7',
      title: 'Muy grande'
    }];
    function sanitize(value) {
      if (typeof window === 'undefined' || !DOMPurify.isSupported) return '';
      return DOMPurify.sanitize(value, {
        ALLOWED_TAGS: ['p', 'div', 'br', 'span', 'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'font', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'hr'],
        ALLOWED_ATTR: ['href', 'title', 'style', 'color', 'face', 'size', 'align', 'colspan', 'rowspan'],
        ALLOW_DATA_ATTR: false,
        ALLOW_ARIA_ATTR: false
      });
    }
    function syncModel(value) {
      html.value = sanitize(value || '');
      if (editorRef.value && editorRef.value.innerHTML !== html.value) {
        editorRef.value.innerHTML = html.value;
        savedSelection = null;
      }
    }
    watch(() => props.value, syncModel, {
      immediate: true
    });
    function isBlocked() {
      return isReadonly.value || isDisabled.value;
    }
    function focusEditor() {
      if (!isDisabled.value) {
        editorRef.value?.focus();
      }
    }
    function saveEditorSelection() {
      if (typeof window === 'undefined' || !editorRef.value) return;
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (editorRef.value.contains(range.startContainer) && editorRef.value.contains(range.endContainer)) {
        savedSelection = range.cloneRange();
      }
    }
    function restoreEditorSelection() {
      const editor = editorRef.value;
      if (typeof window === 'undefined' || !editor) return;
      const selection = window.getSelection();
      if (!selection) return;
      const range = savedSelection && editor.contains(savedSelection.startContainer) && editor.contains(savedSelection.endContainer) ? savedSelection : document.createRange();
      if (range !== savedSelection) {
        range.selectNodeContents(editor);
        range.collapse(false);
      }
      selection.removeAllRanges();
      selection.addRange(range);
    }
    function onInput() {
      const editor = editorRef.value;
      if (!editor) return;
      if (isBlocked()) {
        syncModel(props.value);
        return;
      }
      const clean = sanitize(editor.innerHTML);
      if (editor.innerHTML !== clean) {
        editor.innerHTML = clean;
        savedSelection = null;
      }
      const text = editor.innerText ?? editor.textContent ?? '';
      // Browsers leave <br> or empty blocks behind after deleting the last character.
      html.value = text.replace(/\u00a0/g, ' ').trim() || editor.querySelector('hr, table') ? clean : '';
      emit('input', html.value);
      emit('update:text', text);
      emit('touched', true);
      saveEditorSelection();
    }
    function applyFormat(command, value) {
      if (isBlocked() || typeof document === 'undefined' || !editorRef.value) return;
      focusEditor();
      restoreEditorSelection();
      if (typeof document.execCommand === 'function') {
        document.execCommand(command, false, command === 'insertHTML' ? sanitize(value || '') : value);
        onInput();
      }
    }
    function insertHtml(value) {
      if (isBlocked() || !editorRef.value || typeof document === 'undefined') return;
      focusEditor();
      restoreEditorSelection();
      const clean = sanitize(value);
      if (typeof document.execCommand === 'function' && document.execCommand('insertHTML', false, clean)) {
        onInput();
        return;
      }
      // Some environments lack execCommand; insert only the DOMPurify-cleaned fragment.
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      const fragment = range.createContextualFragment(clean);
      const lastNode = fragment.lastChild;
      range.deleteContents();
      range.insertNode(fragment);
      if (lastNode) range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      onInput();
    }
    function onPaste(event) {
      event.preventDefault();
      if (isBlocked()) return;
      saveEditorSelection();
      const pastedHtml = event.clipboardData?.getData('text/html');
      const text = event.clipboardData?.getData('text/plain') || '';
      const clean = pastedHtml ? sanitize(pastedHtml) : '';
      // Escaping here is only for plain text; HTML sanitization belongs to DOMPurify.
      const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\r\n?|\n/g, '<br>');
      insertHtml(clean || escaped);
    }
    function clear() {
      if (isBlocked() || !editorRef.value) return;
      editorRef.value.innerHTML = '';
      savedSelection = null;
      onInput();
      focusEditor();
    }
    function onValidationModelUpdate(value) {
      if (isBlocked()) return;
      syncModel(value);
      emit('input', html.value);
      emit('update:text', editorRef.value?.innerText ?? editorRef.value?.textContent ?? '');
    }
    function onBlur() {
      focused.value = false;
      if (!isBlocked()) emit('touched', true);
    }
    onMounted(() => {
      syncModel(props.value);
      document.addEventListener('selectionchange', saveEditorSelection);
    });
    onBeforeUnmount(() => {
      if (typeof document !== 'undefined') document.removeEventListener('selectionchange', saveEditorSelection);
      savedSelection = null;
    });
    const editorId = `html-editor-${getCurrentInstance().proxy._uid}`;
    const hasError = computed(() => !!props.errorMessages.length || !!inputRef.value?.hasError);
    return {
      isReadonly,
      isDisabled,
      editorRef,
      inputRef,
      focused,
      html,
      minHeight,
      commands,
      fonts,
      sizes,
      editorId,
      hasError,
      focusEditor,
      focus: focusEditor,
      saveEditorSelection,
      applyFormat,
      onInput,
      onPaste,
      clear,
      onValidationModelUpdate,
      onBlur
    };
  }
};
</script>
<style scoped>
.html-editor ::v-deep .v-input__control { min-width: 0; }
.html-editor__field { width: 100%; min-width: 0; border: 1px solid rgba(127, 127, 127, .38); border-radius: 4px; }
.html-editor__field--filled, .html-editor__field--solo-filled { background: rgba(127, 127, 127, .05); }
.html-editor__field--solo, .html-editor__field--solo-inverted, .html-editor__field--solo-filled { box-shadow: 0 2px 4px rgba(0, 0, 0, .15); border-color: transparent; }
.html-editor__field--solo-inverted { background: rgba(127, 127, 127, .1); }
.html-editor__field--plain { border-color: transparent; }
.html-editor__field--underlined { border-width: 0 0 1px; border-radius: 0; }
.html-editor__field--focused { border-color: var(--v-primary-base, #1976d2); }
.html-editor__field--error { border-color: var(--v-error-base, #ff5252); }
.html-editor__field--disabled { opacity: .5; }
.html-editor__label { display: block; padding: 8px 12px 0; font-size: .875rem; }
.html-editor__label--single { font-size: 1rem; }
.html-editor__toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; padding: 4px; border-bottom: 1px solid rgba(127, 127, 127, .12); }
.html-editor__toolbar select { max-width: 150px; border: 1px solid rgba(127, 127, 127, .25); border-radius: 4px; padding: 4px; color: inherit; }
.html-editor__toolbar option { color: inherit; background: inherit; }
.html-editor__toolbar input[type=color] { width: 32px; height: 28px; cursor: pointer; }
.html-editor__toolbar :disabled { cursor: default; opacity: .5; }
.html-editor__content { display: flex; align-items: flex-start; }
.html-editor__inner-icon { margin: 12px 8px; }
.html-editor__body { flex: 1; min-width: 0; padding: 12px; outline: none; overflow-wrap: anywhere; white-space: pre-wrap; }
.html-editor__body:empty::before { content: attr(data-placeholder); opacity: .5; pointer-events: none; }
.html-editor.v-input--dense .html-editor__body { padding: 8px; }
.html-editor__body ::v-deep ul, .html-editor__body ::v-deep ol { padding-left: 24px; }
.html-editor__body ::v-deep blockquote { border-left: 3px solid rgba(127, 127, 127, .3); padding-left: 12px; margin: 8px 0; }
.html-editor__body ::v-deep table { border-collapse: collapse; max-width: 100%; }
.html-editor__body ::v-deep td, .html-editor__body ::v-deep th { border: 1px solid rgba(127, 127, 127, .25); padding: 4px 8px; }
</style>
