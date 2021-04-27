import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      //控制新建文件夹对话框的显示
      addDirDialogVisible: false,
      renameDialogVisible: false,
      fileMoveDialogVisible: false,
      shareFileName: '',
      sharePath: '',
      count: 0,
      fileLlist: []
    },
    mutations: {
      addDirDialogVisibleToTrue (state) {
        state.addDirDialogVisible = true
      },
      addDirDialogVisibleToFalse (state) {
        state.addDirDialogVisible = false
      },
      renameDialogVisibleToTrue (state) {
        state.renameDialogVisible = true
      },
      renameDialogVisibleToFalse (state) {
        state.renameDialogVisible = false
      },
      fileMoveDialogVisibleToTrue (state) {
        state.fileMoveDialogVisible = true
      },
      fileMoveDialogVisibleToFalse (state) {
        state.fileMoveDialogVisible = false
      },
      setShareFileName(state, fileName) {
        state.shareFileName = fileName
      },
      setSharePath(state, sharePath) {
        state.sharePath = sharePath
      },
      increment (state) {
        state.count++
      },
      updateFileList (state, newFileList) {
        state.fileLlist = newFileList
      }
    },
    actions: {
      updateFileListAsync (context, newFileList) {
        setTimeout(() => {
          context.commit('updateFileList', newFileList)
        }, 1000)
      } 
    }
  })

export default store;