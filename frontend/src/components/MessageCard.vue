<template>
  <div :class="`message ${usertype} ${myMessage ? 'my-message' : ''}`">
    <div class="icon">
      <span class="initials">{{initials}}</span>
    </div>
    <div class="body">
      <div class="username">{{fullname.toUpperCase()}}</div>
      <div class="text">{{text}}</div>
      <div class="datetime">{{formatDate}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      fullname: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      },
      datetime: {
        type: Date,
        required: true
      },
      usertype: {
        type: String,
        required: true
      },
      myMessage: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      initials() {
        if (this.fullname == '') return this.fullname

        const nameParts = this.fullname.split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts[nameParts.length - 1]

        return firstName[0].toUpperCase() + lastName[0].toUpperCase()
      },
      formatDate() {
        const optionsTime = {
          hour: 'numeric', 
          minute: 'numeric',
          hour12: false
        };
        const time = new Intl.DateTimeFormat('pt-BR', optionsTime).format(this.datetime)

        const optionsDate = {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }
        const date = new Intl.DateTimeFormat('pt-BR', optionsDate).format(this.datetime)

        return time + ' - ' + date
      }
    },
  }
</script>

<style lang="scss" scoped>
div.message {
  box-shadow: 0px 1px 3px 0px #88888888;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 8px 16px;
  width: fit-content;
  max-width: 90%;
  display: flex;
  align-self: flex-start;
  
  div.icon {
    width: 40px;
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    min-height: 40px;
    max-height: 40px;
    margin: 6px 10px;
    display: flex;
    border-radius: 50%;
    color: #ffffff;
    font-weight: 500;
    font-size: 20px;

    span.initials {
      margin: auto;
    }
  }
  div.body {
    display: grid;
    flex-grow: 1;
    margin: 0px 8px;
    padding: 4px 10px;

    div.username {
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 4px;
    }
    div.datetime {
      color: #888888;
      font-size: 12px;
      margin-top: 8px;
      text-align: end;
    }
  }
}

div.message.client {
  div.icon {
    background-color: #001245;
  }
  div.username {
    color: #001245;
  }
}
div.message.support {
  div.icon {
    background-color: #BF0410;
  }
  div.username {
    color: #BF0410;
  }
}
div.message.my-message {
  align-self: flex-end;
  flex-flow: row-reverse;
}
</style>