<template>
  <div class="markdown-editor">
    <div class="markdown-editor__toolbar" role="toolbar" aria-label="Editor Markdown">
      <v-btn type="button" small text :aria-pressed="!preview" @click="setPreview(false)">
        Edición
      </v-btn>
      <v-btn type="button" small text :aria-pressed="preview" @click="setPreview(true)">
        Vista previa
      </v-btn>
      <template v-if="!isReadonly && !preview">
        <v-btn
            v-for="action in actions"
            :key="action.id"
            type="button"
            small
            text
            icon
            :title="action.label"
            :aria-label="action.label"
            :disabled="isDisabled"
            @mousedown.prevent
            @click="insert(action.id)"
        ><v-icon small>{{ action.icon }}</v-icon></v-btn>
      </template>
    </div>
    <div
        v-if="preview"
        class="markdown-editor__preview"
        role="region"
        :aria-label="label ? `${label}: vista previa` : 'Vista previa de Markdown'"
        v-html="previewHtml"
    />
    <!-- Hide only the field so the single registered input still displays its details. -->
    <v-textarea
        ref="input"
        class="markdown-editor__input"
        :class="{'markdown-editor__input--preview': preview}"
        :value="content"
        :name="name"
        :label="label"
        :rows="rows"
        :readonly="readonly"
        :disabled="disabled"
        :rules="rules"
        :error-messages="errorMessages"
        :hint="hint"
        :persistent-hint="persistentHint"
        :placeholder="placeholder"
        :persistent-placeholder="persistentPlaceholder"
        :hide-details="hideDetails"
        :clearable="clearable" :outlined="outlined" :filled="filled" :solo="solo" :dense="dense"
        :single-line="singleLine"
        :prepend-icon="prependIcon"
        :append-icon="appendIcon"
        :prepend-inner-icon="prependInnerIcon"
        :append-inner-icon="appendInnerIcon"
        @input="updateValue"
        @blur="!isReadonly && !isDisabled && $emit('touched', true)"
        @select="rememberSelection"
        @keyup="rememberSelection"
        @click="rememberSelection"
        @keydown="onKeydown"
    />
  </div>
</template>

<script>
import { computed, ref, watch, nextTick, inject } from 'vue';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
export default {
  name: "MarkdownEditor",
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
    const content = ref(props.value ?? '');
    const preview = ref(false);
    const input = ref(null);
    const form = inject('form', null);
    const isReadonly = computed(() => props.readonly == null ? !!(form && form.readonly) : props.readonly);
    const isDisabled = computed(() => props.disabled == null ? !!(form && form.disabled) : props.disabled);
    const editingBlocked = computed(() => isReadonly.value || isDisabled.value);
    let selection = {
      start: 0,
      end: 0
    };
    watch(() => props.value, newValue => {
      content.value = newValue ?? '';
    });

    // Per-render options avoid changing marked defaults or DOMPurify's global hooks.
    const previewHtml = computed(() => {
      // DOMPurify has no browser sanitizer in SSR; never fall back to unsanitized HTML.
      if (typeof window === 'undefined') return '';
      return DOMPurify.sanitize(marked.parse(content.value, {
        async: false,
        gfm: true
      }), {
        USE_PROFILES: {
          html: true
        },
        FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea']
      });
    });
    const actions = [{
      id: 'heading',
      label: 'Encabezado',
      icon: 'title'
    }, {
      id: 'bold',
      label: 'Negrita',
      icon: 'format_bold'
    }, {
      id: 'italic',
      label: 'Cursiva',
      icon: 'format_italic'
    }, {
      id: 'strike',
      label: 'Tachado',
      icon: 'strikethrough_s'
    }, {
      id: 'bulleted',
      label: 'Lista con viñetas',
      icon: 'format_list_bulleted'
    }, {
      id: 'numbered',
      label: 'Lista numerada',
      icon: 'format_list_numbered'
    }, {
      id: 'quote',
      label: 'Cita',
      icon: 'format_quote'
    }, {
      id: 'link',
      label: 'Enlace',
      icon: 'link'
    }, {
      id: 'code-block',
      label: 'Bloque de código',
      icon: 'code'
    }, {
      id: 'table',
      label: 'Tabla',
      icon: 'grid_on'
    }, {
      id: 'inline-code',
      label: 'Código en línea',
      icon: 'code'
    }];
    function textarea() {
      return input.value?.$el.querySelector('textarea');
    }
    function rememberSelection() {
      const element = textarea();
      if (element) selection = {
        start: element.selectionStart,
        end: element.selectionEnd
      };
    }
    function updateValue(newValue) {
      if (editingBlocked.value) return;
      content.value = newValue ?? '';
      emit('input', content.value);
      emit('touched');
    }
    async function restoreSelection(start, end) {
      await nextTick();
      const element = textarea();
      if (!element || preview.value || isDisabled.value) return;
      element.focus();
      element.setSelectionRange(start, end);
      selection = {
        start,
        end
      };
    }
    async function setPreview(active) {
      if (active) rememberSelection();
      preview.value = active;
      if (!active) await restoreSelection(selection.start, selection.end);
    }
    async function insert(action) {
      if (editingBlocked.value || preview.value) return;
      rememberSelection();
      const text = content.value;
      let start = Math.min(selection.start, text.length);
      let end = Math.min(selection.end, text.length);
      let selected = text.slice(start, end);
      let replacement = '';
      let offset = 0;
      let length = selected.length;
      if (['heading', 'bulleted', 'numbered', 'quote'].includes(action)) {
        start = start === 0 ? 0 : text.lastIndexOf('\n', start - 1) + 1;
        // A selection ending at the next line's start does not include that line.
        const last = end > start && text[end - 1] === '\n' ? end - 1 : end;
        const lineEnd = text.indexOf('\n', last);
        end = lineEnd === -1 ? text.length : lineEnd;
        selected = text.slice(start, end);
        replacement = selected.split('\n').map((line, index) => {
          const prefix = action === 'heading' ? '## ' : action === 'quote' ? '> ' : action === 'numbered' ? `${index + 1}. ` : '- ';
          return prefix + line;
        }).join('\n');
        length = replacement.length;
      } else if (action === 'code-block' || action === 'table') {
        const prefix = start > 0 && text[start - 1] !== '\n' ? '\n\n' : '';
        const suffix = end < text.length && text[end] !== '\n' ? '\n\n' : '\n';
        if (action === 'code-block') {
          const content = selected || 'código';
          const fence = '`'.repeat(Math.max(3, ...Array.from(content.matchAll(/`+/g), match => match[0].length + 1)));
          replacement = `${prefix}${fence}\n${content}\n${fence}${suffix}`;
          offset = prefix.length + fence.length + 1;
          length = content.length;
        } else {
          replacement = `${prefix}| Columna 1 | Columna 2 |\n| --- | --- |\n| ${selected.replace(/\|/g, '\\|').replace(/\n/g, ' ') || 'Texto'} | Texto |${suffix}`;
          offset = prefix.length;
          length = replacement.length - prefix.length - suffix.length;
        }
      } else {
        const markers = {
          bold: ['**', '**', 'texto'],
          italic: ['*', '*', 'texto'],
          strike: ['~~', '~~', 'texto'],
          link: ['[', '](https://example.com)', 'enlace'],
          'inline-code': ['`', '`', 'código']
        };
        const marker = markers[action];
        if (!marker) return;
        let [before, after, fallback] = marker;
        const content = selected || fallback;
        if (action === 'inline-code') {
          const fence = '`'.repeat(Math.max(1, ...Array.from(content.matchAll(/`+/g), match => match[0].length + 1)));
          const padding = /^[` ]|[` ]$/.test(content) ? ' ' : '';
          before = fence + padding;
          after = padding + fence;
        }
        replacement = before + content + after;
        offset = before.length;
        length = content.length;
      }
      updateValue(text.slice(0, start) + replacement + text.slice(end));
      await restoreSelection(start + offset, start + offset + length);
    }
    function onKeydown(event) {
      if (!(event.ctrlKey || event.metaKey) || event.altKey || editingBlocked.value || preview.value) return;
      const key = event.key.toLowerCase();
      if (key === 'b' || key === 'i') {
        event.preventDefault();
        void insert(key === 'b' ? 'bold' : 'italic');
      }
    }
    return {
      content,
      preview,
      input,
      isReadonly,
      isDisabled,
      previewHtml,
      actions,
      updateValue,
      rememberSelection,
      setPreview,
      insert,
      onKeydown
    };
  }
};
</script>
<style scoped>
.markdown-editor__input--preview ::v-deep .v-input__slot {
  display: none;
}

.markdown-editor__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.markdown-editor__preview {
  min-height: 8rem;
  padding: 16px;
  overflow-wrap: anywhere;
  border: 1px solid rgba(127, 127, 127, 0.25);
  border-radius: 4px;
}

.markdown-editor__preview ::v-deep pre {
  padding: 12px;
  overflow-x: auto;
  background: rgba(127, 127, 127, 0.06);
}

.markdown-editor__preview ::v-deep table {
  display: block;
  overflow-x: auto;
  border-collapse: collapse;
}

.markdown-editor__preview ::v-deep th,
.markdown-editor__preview ::v-deep td {
  padding: 6px 12px;
  border: 1px solid rgba(127, 127, 127, 0.25);
}

.markdown-editor__preview ::v-deep blockquote {
  margin: 8px 0;
  padding-left: 16px;
  border-left: 4px solid rgba(127, 127, 127, 0.25);
}

.markdown-editor__preview ::v-deep ul,
.markdown-editor__preview ::v-deep ol {
  padding-left: 24px;
}

.markdown-editor__preview ::v-deep img {
  max-width: 100%;
}
</style>
