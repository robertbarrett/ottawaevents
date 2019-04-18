import praw
import sqlite3
import credentials


def isSubscribed(author):
  conn = sqlite3.connect('users.db')
  c = conn.cursor()
  c.execute("SELECT COUNT(*) FROM users WHERE username=?", (str(author),))
  result = c.fetchone()[0]
  conn.close()
  if result == 0:
    return False
  else:
    return True

def sendMessage(recipient, message):
  reddit.redditor(recipient).message('Ottawa Events', message+"\n-----------\n^(If you're having any issues with this bot, please message /u/SergeantAlPowell directly)")


def subscribeUser(user):
  conn = sqlite3.connect('users.db')
  c = conn.cursor()
  c.execute("INSERT INTO users(username, isadmin) VALUES(?,?)", (str(user), 0))
  conn.commit()
  conn.close()

def unsubscribeUser(user):
  conn = sqlite3.connect('users.db')
  c = conn.cursor()
  c.execute("DELETE FROM users WHERE username=?", (str(user), ))
  conn.commit()
  conn.close()

def sendToUsers(message):
  conn = sqlite3.connect('users.db')
  c = conn.cursor()
  c.execute("SELECT username FROM users")
  for row in c.fetchall():
    sendMessage(row[0],message)
  conn.close()

def isAdmin(user):
  conn = sqlite3.connect('users.db')
  c = conn.cursor()
  c.execute("SELECT COUNT(*) FROM users WHERE username=? AND isadmin=1", (str(user), ))
  result = c.fetchone()[0]
  conn.close()
  if result == 0:
    return False
  else:
    return True



reddit = praw.Reddit(user_agent='SergeantAlPowells Bot by /u/SergeantAlPowell',
    client_id=credentials.client_id, client_secret=credentials.client_secret,
    username=credentials.username, password=credentials.password)



while True:
  unread_messages = []
  for item in reddit.inbox.unread(limit=None):
    if isinstance(item, praw.models.Message):
      unread_messages.append(item)
      if item.subject.lower() == "subscribe":
        if isSubscribed(str(item.author)):
          sendMessage(str(item.author),"You're already subscribed.")
          sendMessage("SergeantAlPowell",str(item.author) + " tried to subscribe, but was already subscribed")
        else:
          subscribeUser(item.author)
          sendMessage(str(item.author),"You'll now recieve a message when a new thread is posted. To unsubscribe, send me a message using this [link](https://www.reddit.com/message/compose/?to=SergeantAlPowellsBot&subject=Unsubscribe&message=Unsubscribe).")
          sendMessage("SergeantAlPowell",str(item.author) + " subscribed")
      elif item.subject.lower() == "unsubscribe":
        if isSubscribed(str(item.author)):
          sendMessage(str(item.author),"You're already not subscribed.")
          sendMessage("SergeantAlPowell",str(item.author) + " tried to unsubscribe, but was already unsubscribed")
        else:
          unsubscribeUser(str(item.author))
          sendMessage(str(item.author),"You're now unsubscribed")
          sendMessage("SergeantAlPowell",str(item.author) + " unsubscribed")
      elif item.subject.lower() == "update":
        if isAdmin(str(item.author)):
          sendToUsers(item.body)
        else:
          sendMessage(str(item.author),"Sorry, only admins can send updates")


      reddit.inbox.mark_read(unread_messages) #the idea here was to process 'unsubscribe' messages before 'update' meessages. Not doing that right now, don't really care that much
