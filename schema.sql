--
-- PostgreSQL database dump
--

-- Dumped from database version 14.12 (Homebrew)
-- Dumped by pg_dump version 14.12 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: todolists; Type: TABLE; Schema: public; Owner: shuka
--

CREATE TABLE public.todolists (
    id integer NOT NULL,
    title text NOT NULL
);


ALTER TABLE public.todolists OWNER TO shuka;

--
-- Name: todolists_id_seq; Type: SEQUENCE; Schema: public; Owner: shuka
--

CREATE SEQUENCE public.todolists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todolists_id_seq OWNER TO shuka;

--
-- Name: todolists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shuka
--

ALTER SEQUENCE public.todolists_id_seq OWNED BY public.todolists.id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: shuka
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    title text NOT NULL,
    done boolean DEFAULT false NOT NULL,
    todolist_id integer NOT NULL
);


ALTER TABLE public.todos OWNER TO shuka;

--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: shuka
--

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todos_id_seq OWNER TO shuka;

--
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shuka
--

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: shuka
--

CREATE TABLE public.users (
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO shuka;

--
-- Name: todolists id; Type: DEFAULT; Schema: public; Owner: shuka
--

ALTER TABLE ONLY public.todolists ALTER COLUMN id SET DEFAULT nextval('public.todolists_id_seq'::regclass);


--
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: shuka
--

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);


--
-- Data for Name: todolists; Type: TABLE DATA; Schema: public; Owner: shuka
--

COPY public.todolists (id, title) FROM stdin;
1	Work Todos
4	social todos
3	aasocial todosss
5	d
6	qwertyuiopasdfghjklzxcvbnm,qawesdcfghvbjnygouglds
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: shuka
--

COPY public.todos (id, title, done, todolist_id) FROM stdin;
2	Chat with co-workers	t	1
3	Duck out of meeting	t	1
11	what	f	6
10	social todos	t	3
8	Go to libby's birthday party	t	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: shuka
--

COPY public.users (username, password) FROM stdin;
admin	secret
developer	letmein
somebody	knock-knock
\.


--
-- Name: todolists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shuka
--

SELECT pg_catalog.setval('public.todolists_id_seq', 6, true);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shuka
--

SELECT pg_catalog.setval('public.todos_id_seq', 11, true);


--
-- Name: todolists todolists_pkey; Type: CONSTRAINT; Schema: public; Owner: shuka
--

ALTER TABLE ONLY public.todolists
    ADD CONSTRAINT todolists_pkey PRIMARY KEY (id);


--
-- Name: todolists todolists_title_key; Type: CONSTRAINT; Schema: public; Owner: shuka
--

ALTER TABLE ONLY public.todolists
    ADD CONSTRAINT todolists_title_key UNIQUE (title);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: shuka
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: shuka
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: todos todos_todolist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shuka
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_todolist_id_fkey FOREIGN KEY (todolist_id) REFERENCES public.todolists(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

