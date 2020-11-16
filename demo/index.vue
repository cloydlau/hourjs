<template>
  <el-dialog visible :close-on-click-modal="false" :execute-close="false" title="hourjs">
    <el-form
      :model="model"
      label-width="auto"
    >
      <el-form-item>
        <el-time-picker
          placeholder="init"
          v-model="model.init"
          :value-format="'HH:mm'+(containSeconds.init?':ss':'')"
          :format="'HH:mm'+(containSeconds.init?':ss':'')"
          :disabled="isNow.init"
        />
        <el-checkbox v-model="isNow.init" label="当前时间" border/>
        <el-checkbox v-model="containSeconds.init" label="精确到秒" border @change="complement"/>
      </el-form-item>
      <el-form-item>
        <el-time-picker
          placeholder="start"
          v-model="model.start"
          :value-format="'HH:mm'+(containSeconds.start?':ss':'')"
          :format="'HH:mm'+(containSeconds.start?':ss':'')"
          :disabled="isNow.start"
        />
        <el-checkbox v-model="isNow.start" label="当前时间" border/>
        <el-checkbox v-model="containSeconds.start" label="精确到秒" border @change="complement"/>
      </el-form-item>
      <el-form-item>
        <el-time-picker
          placeholder="end"
          v-model="model.end"
          :value-format="'HH:mm'+(containSeconds.end?':ss':'')"
          :format="'HH:mm'+(containSeconds.end?':ss':'')"
          :disabled="isNow.end"
        />
        <el-checkbox v-model="isNow.end" label="当前时间" border/>
        <el-checkbox v-model="containSeconds.end" label="精确到秒" border @change="complement"/>
      </el-form-item>

      <el-form-item label="比较运算" class="block">
        <el-button-group>
          <el-button @click="execute(()=>hourjs(model.init).isBetween(model.start, model.end))">
            {{ `hourjs(${model.init || ''}).isBetween(${model.start || ''}, ${model.end || ''})` }}
          </el-button>
          <el-button @click="execute(()=>hourjs(model.init).isBefore(model.start))">
            {{ `hourjs(${model.init || ''}).isBefore(${model.start || ''})` }}
          </el-button>
          <el-button @click="execute(()=>hourjs(model.init).isSameOrBefore(model.start))">
            {{ `hourjs(${model.init || ''}).isSameOrBefore(${model.start || ''})` }}
          </el-button>
          <el-button @click="execute(()=>hourjs(model.init).isAfter(model.start))">
            {{ `hourjs(${model.init || ''}).isAfter(${model.start || ''})` }}
          </el-button>
          <el-button @click="execute(()=>hourjs(model.init).isSameOrAfter(model.start))">
            {{ `hourjs(${model.init || ''}).isSameOrAfter(${model.start || ''})` }}
          </el-button>
        </el-button-group>
      </el-form-item>

      <el-form-item label="差值计算" class="block">
        <el-button @click="execute(()=>hourjs(model.start).preciseDiff(model.end),'diff')">
          {{ `hourjs(${model.start || ''}).preciseDiff(${model.end || ''})` }}
        </el-button>
        <el-input disabled :value="result.diff"/>
      </el-form-item>

      <el-form-item label="加减运算">
        <el-time-picker
          v-model="model.operation"
          :value-format="'HH:mm'+(containSeconds.operation?':ss':'')"
          :format="'HH:mm'+(containSeconds.operation?':ss':'')"
          :disabled="operation.isNow"
        />
        <el-checkbox v-model="operation.isNow" label="当前时间" border/>
        <el-checkbox v-model="containSeconds.operation" label="精确到秒" border @change="complement"/>
        <Selector v-model="operation.operator" :options="operation.operatorOptions"
                  style="width:60px;display:block;margin:10px 0;" :clearable="false"/>
        <el-input-number v-model="operation.addend" :precision="0"/>
        <Selector v-model="operation.unit" :options="operation.unitOptions"/>
        <div>
          <el-button @click="operate"
                     style="width:60px;margin:10px 0;">
            =
          </el-button>
        </div>
        <el-input disabled :value="result.operation"/>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import hourjs from '../src/index'
import { Selector } from 'plain-kit'

export default {
  components: { Selector },
  data () {
    return {
      model: {
        init: '',
        start: '',
        end: '',
        operation: ''
      },
      containSeconds: {
        init: false,
        start: false,
        end: false,
        operation: false,
      },
      isNow: {
        init: false,
        start: false,
        end: false
      },
      operation: {
        isNow: false,
        addend: 0,
        unit: 'hour',
        operator: '+',
        operatorOptions: [
          { dataValue: '+', dataName: '+' },
          { dataValue: '-', dataName: '-' },
        ],
        unitOptions: [
          { dataValue: 'hour', dataName: 'hour' },
          { dataValue: 'minute', dataName: 'minute' },
          { dataValue: 'second', dataName: 'second' },
        ],
      },
      result: {
        diff: '',
        operation: ''
      }
    }
  },
  methods: {
    hourjs,
    toStr (time: number): string {
      return (time < 10 ? '0' : '') + time
    },
    execute (fn, which) {
      for (let k in this.isNow) {
        if (this.isNow[k]) {
          const date = new Date()
          this.model[k] = this.toStr(date.getHours()) + ':' +
            this.toStr(date.getMinutes()) +
            (this.containSeconds[k] ? ':' + this.toStr(date.getSeconds()) : '')
        }
      }
      try {
        const result = fn()
        if (typeof result === 'boolean') {
          result ? this.$message.success('true') : this.$message.error('false')
        } else {
          this.result[which] = result ? JSON.stringify(result) : ''
        }
      } catch (e) {
        this.$message.error(e.toString())
      }
    },
    complement () {
      for (let k in this.containSeconds) {
        if (this.containSeconds[k] && this.model[k].length === 5) {
          this.model[k] += ':00'
        }
      }
    },
    operate () {
      if (this.operation.operator === '+') {
        this.execute(() => hourjs(this.model.operation).add(this.operation.addend, this.operation.unit), 'operation')
      } else {
        this.execute(() => hourjs(this.model.operation).subtract(this.operation.addend, this.operation.unit), 'operation')
      }
    }
  }
}
</script>

<style lang="scss">
.el-dialog {
  min-width: 600px;
}

.el-checkbox {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.block {
  .el-button {
    width: 100%;
  }
}

/*.el-input {
  width: calc(100% - 224px) !important;
}
*/
</style>
