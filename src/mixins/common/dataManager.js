
export const dataManagerMixin = {
  methods: {
    updateData() {
      setTimeout(() => {
        this.$message.loading('正在检查数据更新...', 0);
      }, 0)
      // const hide = this.$message.loading('正在检查数据更新...', 0);
      this.$store.dispatch('updateFromNullStorage').then(() => {
        this.$store.dispatch('checkUpdateAllInfos').then((data) => {
          if (data != null) {
            const hide2 = this.$message.loading('正在更新基础数据...', 0);
            hide2();
            this.$store.dispatch('updateAllClassroomInfo', '惟义楼').then(() => {
              this.$message.success('课程数据已更新！');
            }).catch(()=> {
              this.$message.error('更新课程数据时出错，请刷新页面重试！', 30);
            }).finally(()=> {
              this.$store.commit('LOADED', true);
            });
          } else {
            this.$store.commit('LOADED', true);
          }
        }).catch(()=>{
          this.$message.error('更新课程数据时出错，请刷新页面重试！', 30);
          this.$store.commit('LOADED', true);
        }).finally(()=>{

          this.$destroyAll();
          // hide();
        });

      });
    },
  },
};
