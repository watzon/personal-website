---
date: 2022-12-07T18:53:50.702Z
title: An introduction to the Crystal standard library and its core modules
description: A brief introduction to the Crystal standard library and its core modules for those new to the language
tags:
  - crystal
  - programming
thumbnail: /images/uploads/introduction-to-the-crystal-standard-library-and-core-modules.jpeg
---

Crystal is a modern, high-performance programming language that combines the expressiveness of Ruby with the efficiency of low-level languages like C. One of the key features of Crystal is its rich and comprehensive standard library, which provides a wide range of tools and modules for common tasks and operations. In this blog post, I'll introduce the Crystal standard library and highlight some of its core modules and functions. Whether you're new to Crystal or an experienced user, this article will give you a better understanding of the power and flexibility of the language.

One of the greatest strengths of Crystal lies in its standard library, or the modules, classes, and functions that come baked in to the language. From the beginning, Crystal has pulled inspiration from Ruby. This can be seen in the syntax most obviously, but it's also very apparent in its standard library. Glancing through the [API docs](https://crystal-lang.org/api) you'll see a lot of familiar modules (assuming you're familiar with Ruby that is). While there are way too many modules to go over individually, I want to highlight some of the ones that stand out the most to me when coming from other languages.

## HTTP

One of Crystal's biggest strengths is its ability to bridge the gap between dynamic languages like Ruby and Python, and typed languages like Rust and C when it comes to web development. The reason this is possible is because of its amazing HTTP module, which comes with a [Client](https://crystal-lang.org/api/1.6.2/HTTP/Client.html) for making requests, and a [Server](https://crystal-lang.org/api/1.6.2/HTTP/Server.html) for receiving them. As a matter of fact, the home page of Crystal's website shows a very simple HTTP server in action, and it really could not be simpler.

```crystal
# A very basic HTTP server
require "http/server"

server = HTTP::Server.new do |context|
  context.response.content_type = "text/plain"
  context.response.print "Hello world, got #{context.request.path}!"
end

puts "Listening on http://127.0.0.1:8080"
server.listen(8080)
```

Running that code will leave you with a very basic server running on port `8080` which will return "Hello world, got _\[some path\]_!" for every path you hit. Of course, using the built-in HTTP server isn't the only way to use Crystal for a website. There are a myriad of options from [Kemal](<(https://kemalcr.com/)>) and [Grip](https://github.com/grip-framework/grip) which are both very Sinatra/Flask like, to [Lucky](https://luckyframework.org/) which is closer to Rails (not at all in design, but it takes the batteries included approach).

Of course, the HTTP module would be nothing without

## IO

Some may see this as one of the more boring classes, but I have used IO so much in my work with Crystal that I'd be remiss if I didn't give it a shoutout here. IO makes it possible to deal with streams of data, whether those are coming from a TCP connection, a parser, or something else. As the name implies, IO deals with input/output and is used by other classes within the standard library such as [File](https://crystal-lang.org/api/1.6.2/File.html) and [Socket](https://crystal-lang.org/api/1.6.2/Socket.html).

`IO::Memory` can be used as a sort of in-memory file descriptor, but what I've found to be one of the most useful (albeit niche) parts of IO is `IO::ByteFormat` which allows you to encode and decode integers to/from `Bytes` and `IO`. This is extremely useful when implementing things such as protocol buffers and RPC. And look how easy it is:

```crystal
io = IO::Memory.new
io.write_bytes(0x1234_i16, IO::ByteFormat::LittleEndian)
io.to_slice # => Bytes[0x34, 0x12]

int16 = io.read_bytes(Int16, IO::ByteFormat::LittleEndian)
int16 # => 0x1234_i16
```

A bit more verbose than I'd prefer, but you can't argue with results.

## JSON

What would a web-centric language be without support for JSON. Now I'm not saying that Crystal is intentionally web-centric, but it is filling a hole that Ruby leaves by being slow as molasses, and Ruby is used _heavily_ for web development.

Working with JSON in statically typed languages can be a massive pain, because JSON is, by its very nature, untyped and kind of unsafe to deal with. Before finding Crystal I loved the way Go handled JSON (de)serialization. As an example for those unfamiliar:

```go
type User struct {
    Name        string `json:"full_name"`
    Age         int    `json:"age,omitempty"`
    Active      bool   `json:"-"`
    lastLoginAt string
}
```

As you can see Go uses "tags" to change how the JSON data is transformed when it's marshaled into the `User` struct. In this example the JSON key `full_name` will become `Name`, `age` will become `Age` and an empty value will be discarded, `Active` will be removed entirely thanks to the `"-"` and `lastLoginAt` will be read in as is.

Now I'll show a similar example using Crystal:

```crystal
struct User
  include JSON::Serializable

  @[JSON::Field(key: "full_name")]
  getter name : String

  getter age : Int32?

  @[JSON::Field(ignore: true)]
  getter active : Bool = false

  @[JSON::Field(key: "lastLoginAt")]
  getter last_login_at : String
end
```

Things are a bit different here, partially because different assumptions have to be made. The first field, `name`, is doing the same thing; we're taking the `full_name` JSON field and calling it `name` in this struct. `age` is defined as a nilable field, and will be nil by default if the `age` property doesn't show up in the JSON. `active` is being ignored, so we set a default value for it to keep the compiler from yelling at us. Lastly we're going to rename `lastLoginAt` to `last_login_at` to keep things in line with Crystal conventions.

Parsing an incoming JSON object as a `User` would then be as simple as:

```crystal
user = User.from_json(json_string)
```

And assuming the JSON matches the schema, you'll be left with a `User` object to work with.

There is also a `YAML` module which functions almost identically, and I'm working on a TOML shard right now which I intend to have the same API to keep things smooth.

## Time

I'm going to end with Time, because time is another one of those things that's typically a pain in the butt to work with, but Crystal makes it easy. For anyone coming from Ruby, none of this will be new to you, other than the fact that Crystal just has a `Time` module, no `Date` and no `DateTime`. This drastically simplifies things.

One thing that's important to note is that Crystal does use an `Int64` for representing time and the supported date range is `0001-01-01 00:00:00.0` to `9999-12-31 23:59:59.999_999_999` in any local time zone. That means we don't have to worry about running out of dates for 7,676 years or so. I think most languages have started switching to a 64-bit time representation if possible, but I just thought it would be good to point that out.

The entire `Time` module is full of so much syntactic sugar you might leave with a toothache, but I find it to be extremely useful if you want to work with time in an idiomatic and easy to understand manner. For instance:

```crystal
time = Time.utc(2016, 2, 15, 10, 20, 30)
time.year        # => 2016
time.month       # => 2
time.day         # => 15
time.hour        # => 10
time.minute      # => 20
time.second      # => 30
time.millisecond # => 0
time.nanosecond  # => 0
time.day_of_week # => Time::DayOfWeek::Monday
time.day_of_year # => 46
time.monday?     # => true
time.time_of_day # => 10:20:30
```

You can also do math with time.

```crystal
Time.utc + 3.days
Time.utc - 14.years
# etc etc
```

Need to localize things to a specific timezone? No problem.

```crystal
time = Time.local(2016, 2, 15, 10, 20, 30, location: Time::Location.load("Europe/Berlin"))
time.inspect # => "2016-02-15 10:20:30.0 +01:00 Europe/Berlin"
```

This isn't unique to the `Time` module. There is syntactic sugar all over the standard library that's there to make your life easier. Which leads me to my last section.

## How much is too much?

If there's anything I wanted to convey in this post, it's that Crystal's standard library is awesome. I barely scratched the surface of the useful classes and modules that exist within. But with great power... No scratch that. With large standard libraries, come the pain of forgetting about all of those useful tools when you need them most. Some, the ones you use most often, you'll of course remember, but what about the ones you only find yourself needing once in a while? You're probably going to forget they even exist.

Is this a problem with the language? Or even the standard library itself? I don't think so. The human brain only has so much capacity for standard library documentation, and even with a smaller library, you'd probably still have trouble remembering the useful stuff when you need it. In the end, this is why we have documentation in the first place. Sometimes I'll just pick a random class or module and read through the API documentation to learn about some of the useful tools I didn't know exist. I'm just grateful that so much time and effort has been put into developer happiness when it comes to the standard library, and Crystal itself.
