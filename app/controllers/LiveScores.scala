package controllers

import play.api.libs.iteratee.Concurrent.Channel
import play.api.mvc._
import play.api.libs.json.JsValue
import play.api.libs.iteratee.{Concurrent, Enumeratee}
import play.api.libs.EventSource
import play.api.libs.concurrent.Execution.Implicits._

class LiveScores extends Controller {

  val (feedOut, feedChannel: Channel[JsValue]) = Concurrent.broadcast[JsValue]

  def index = Action { Ok(views.html.live()) }

  def admin = Action { Ok(views.html.admin()) }

  def postUpdate = Action(parse.json) { request =>
    println(request.body)
    feedChannel.push(request.body)
    Ok(request.body)
  }

  def connDeathWatch(address: String): Enumeratee[JsValue, JsValue] =
    Enumeratee.onIterateeDone { () => println(s"$address - SSE disconnected") }

  def liveFeed = Action { request =>
    println(s"${request.remoteAddress} - SSE connected")
    Ok.feed(feedOut
      &> Concurrent.buffer(1)
      &> connDeathWatch(request.remoteAddress)
      &> EventSource()
    ).as("text/event-stream")
  }

}
