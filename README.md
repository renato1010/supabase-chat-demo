## Supabase Chat demo

Demo to show the [Supabase](https://supabase.com/) feature, specifically the authorization via Github OAuth and the real-time database.

This demo is based on egghead.io course https://egghead.io/courses/build-a-real-time-data-syncing-chat-application-with-supabase-and-next-js-84e58958  
The twist we did was, we made the demo completely written with Typescript instead of Javascript(original).

Demo a simple implementation of a real-time update for a Chat application.

To start you'll need an `.env.local` file with a couple of **env** vars,  
you can get those from Supabase(free tier), create a new project and go to:  
settings > API

![Supabase dashboard env vars](https://icons-images.s3.us-east-2.amazonaws.com/supabase_env_vars.png)

Will need to create two tables: dashboard > Table editor:  
_table message_

![supabase table message](https://icons-images.s3.us-east-2.amazonaws.com/supabase-table-message.png)

_table user_

![supabase table user](https://icons-images.s3.us-east-2.amazonaws.com/supabase-table-user.png)
Also will need to activate the real time feature for the two tables **user** and **message**

To activate **subscription** will need to set up **replication** like this:

![supabase-set-up-replication](https://icons-images.s3.us-east-2.amazonaws.com/setup-real-time_tables_2022-05-02-+09-17.gif)

## Set Configuration

_Set the Supabase client_ at `utils/useSupabase.ts`

```ts
import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";
...
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY;

if (!url || !publicKey) {
  throw new Error("Error starting app");
}
const supabase = createClient(url, publicKey);

export type UseSupaBase = {
  session: Session | null;
  supabase: SupabaseClient;
  currentUser: PublicUser | null;
};

```

Authorization: we did an implementation using the **login with Github**

## Demo

`ctrl + click to open in another tab`

[supabase chat demo](https://icons-images.s3.us-east-2.amazonaws.com/demo-supabase.mov)
