package service;

import model.CoreSubject;
import model.CoreTopic;
import repository.ProgressRepository;

import java.util.*;

public class CoreSubjectService {
    private final ProgressRepository progressRepository;
    private StreakService streakService;
    private final List<CoreSubject> subjects = new ArrayList<>();
    private final Map<String, CoreTopic> topicMap = new HashMap<>();

    public CoreSubjectService(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
        initSubjects();
    }

    public void setStreakService(StreakService streakService) {
        this.streakService = streakService;
    }

    private void initSubjects() {
        // 1. DBMS
        CoreSubject dbms = new CoreSubject("dbms", "Database Management Systems", "Relational databases, indexing, transactions, and SQL queries asked in interviews.");
        addTopic(dbms, "dbms_sql", "SQL & Complex Queries", "Master SELECT, WHERE, GROUP BY, HAVING, subqueries, and window functions.", "Interviewers frequently ask to write real-time SQL queries with aggregation and joins.", "GeeksforGeeks SQL Tutorial", "https://www.geeksforgeeks.org/sql-tutorial/");
        addTopic(dbms, "dbms_keys", "Database Keys & ER Model", "Primary key, foreign key, candidate key, alternate key, and entity relationships.", "Essential for schema design and basic technical screening rounds.", "GeeksforGeeks DBMS Keys", "https://www.geeksforgeeks.org/types-of-keys-in-relational-model/");
        addTopic(dbms, "dbms_norm", "Normalization (1NF to BCNF)", "Decomposition techniques to eliminate data redundancy and anomalies.", "Core theory question in every product company tech round.", "W3Schools Normalization", "https://www.geeksforgeeks.org/normal-forms-in-dbms/");
        addTopic(dbms, "dbms_acid", "Transactions & ACID Properties", "Atomicity, Consistency, Isolation, and Durability guarantees.", "Crucial for system design, distributed systems, and backend roles.", "GeeksforGeeks ACID Properties", "https://www.geeksforgeeks.org/acid-properties-in-dbms/");
        addTopic(dbms, "dbms_concurr", "Concurrency Control & Deadlocks", "Locking protocols, 2PL, isolation levels, and serializability.", "Tested heavily when discussing high-throughput application design.", "TutorialsPoint Concurrency", "https://www.tutorialspoint.com/dbms/dbms_concurrency_control.htm");
        addTopic(dbms, "dbms_indexing", "Indexing & B/B+ Trees", "Clustered vs non-clustered indexing and query lookup mechanics.", "Frequent optimization topic during tech interviews.", "GeeksforGeeks Indexing in DBMS", "https://www.geeksforgeeks.org/indexing-in-databases/");
        addTopic(dbms, "dbms_joins", "Joins & Query Execution", "INNER, LEFT, RIGHT, FULL OUTER joins and query execution plans.", "Practical interview coding question in database rounds.", "W3Schools SQL Joins", "https://www.w3schools.com/sql/sql_join.asp");
        subjects.add(dbms);

        // 2. Operating Systems
        CoreSubject os = new CoreSubject("os", "Operating Systems", "Process management, memory virtualization, concurrency, and storage.");
        addTopic(os, "os_proc", "Processes vs Threads", "Process control blocks (PCB), thread states, and context switching.", "Universal top-5 OS interview question in all placement tests.", "GeeksforGeeks Process vs Thread", "https://www.geeksforgeeks.org/difference-between-process-and-thread/");
        addTopic(os, "os_sched", "CPU Scheduling Algorithms", "FCFS, SJF, Round Robin, Priority Scheduling, and starvation.", "Tested in MCQs, coding interviews, and written tests.", "GeeksforGeeks CPU Scheduling", "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/");
        addTopic(os, "os_sync", "Process Synchronization & Semaphores", "Critical section problem, mutex, semaphores, and race conditions.", "Fundamental topic for multi-threaded programming questions.", "TutorialsPoint Process Synchronization", "https://www.tutorialspoint.com/operating_system/os_process_synchronization.htm");
        addTopic(os, "os_deadlock", "Deadlocks & Prevention", "Deadlock conditions, Bankers algorithm, prevention, and detection.", "Very common in campus placement written rounds.", "GeeksforGeeks Deadlock", "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/");
        addTopic(os, "os_mem", "Memory Management & Paging", "Contiguous allocation, paging, segmentation, and fragmentation.", "Tested rigorously in technical interviews.", "GeeksforGeeks Memory Management", "https://www.geeksforgeeks.org/memory-management-in-operating-system/");
        addTopic(os, "os_virtmem", "Virtual Memory & Page Replacement", "Demand paging, page faults, FIFO, LRU, and Optimal replacement algorithms.", "High probability interview topic with numerical problems.", "GeeksforGeeks Page Replacement", "https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/");
        addTopic(os, "os_ipc", "System Calls & Inter-Process Communication", "Pipes, shared memory, message queues, and sockets.", "Vital for systems and backend engineering roles.", "GeeksforGeeks IPC", "https://www.geeksforgeeks.org/inter-process-communication-ipc/");
        subjects.add(os);

        // 3. Computer Networks
        CoreSubject cn = new CoreSubject("cn", "Computer Networks", "Network architectures, protocols, routing, transport layer, and web security.");
        addTopic(cn, "cn_osi", "OSI & TCP/IP Models", "7 layers of OSI model, encapsulation, and functional duties of each layer.", "Standard opening question in network rounds.", "GeeksforGeeks OSI Model", "https://www.geeksforgeeks.org/layers-of-osi-model/");
        addTopic(cn, "cn_ip", "IP Addressing, Subnetting & CIDR", "IPv4, IPv6, classes, subnet masks, and network prefix calculation.", "Popular in online assessment MCQs.", "GeeksforGeeks Subnetting", "https://www.geeksforgeeks.org/introduction-to-subnetting/");
        addTopic(cn, "cn_tcp_udp", "TCP vs UDP & 3-Way Handshake", "Connection-oriented vs connectionless, flow control, and TCP termination.", "One of the most frequently asked network questions.", "GeeksforGeeks TCP vs UDP", "https://www.geeksforgeeks.org/differences-between-tcp-and-udp/");
        addTopic(cn, "cn_http", "HTTP/HTTPS, TLS & WebSockets", "HTTP methods, status codes, SSL/TLS handshake, and bi-directional sockets.", "Must-know for full-stack, frontend, and backend interviews.", "MDN HTTP Overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview");
        addTopic(cn, "cn_dns", "DNS Architecture & Resolution", "How domain names map to IP addresses, authoritative servers, and caching.", "Standard question in 'What happens when you type a URL in browser?'", "Cloudflare DNS Guide", "https://www.cloudflare.com/learning/dns/what-is-dns/");
        addTopic(cn, "cn_routing", "Routing Protocols & Algorithms", "Distance Vector, Link State, OSPF, BGP, and Dijkstra routing.", "Core academic and competitive test topic.", "GeeksforGeeks Routing Algorithms", "https://www.geeksforgeeks.org/routing-algorithms-in-computer-networks/");
        subjects.add(cn);

        // 4. Object-Oriented Programming
        CoreSubject oop = new CoreSubject("oop", "Object-Oriented Programming", "Class hierarchies, design paradigms, encapsulation, polymorphism, and SOLID principles.");
        addTopic(oop, "oop_class", "Classes, Objects & Constructors", "Instance variables, constructor overloading, copy constructors, and memory layout.", "Foundation for all object-oriented language discussions.", "GeeksforGeeks OOP Basics", "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/");
        addTopic(oop, "oop_encap", "Encapsulation & Data Hiding", "Access specifiers (private, protected, public) and getter/setter practices.", "First pillar tested in conceptual interviews.", "W3Schools Encapsulation", "https://www.w3schools.com/java/java_encapsulation.asp");
        addTopic(oop, "oop_inherit", "Inheritance & Types of Inheritance", "Single, multiple, multilevel, hierarchical inheritance and diamond problem.", "Asked in language-specific syntax tests (Java, C++, Python).", "GeeksforGeeks Inheritance", "https://www.geeksforgeeks.org/inheritance-in-java/");
        addTopic(oop, "oop_poly", "Polymorphism (Static vs Dynamic)", "Method overloading vs overriding, dynamic method dispatch, and virtual tables.", "Extremely popular interview topic.", "GeeksforGeeks Polymorphism", "https://www.geeksforgeeks.org/polymorphism-in-java/");
        addTopic(oop, "oop_abstract", "Abstraction & Interfaces", "Abstract classes vs interfaces, default methods, and contracts.", "Key distinction examined in software design interviews.", "GeeksforGeeks Abstract Classes", "https://www.geeksforgeeks.org/difference-between-abstract-class-and-interface-in-java/");
        addTopic(oop, "oop_solid", "SOLID Design Principles", "Single Responsibility, Open-Closed, Liskov, Interface Segregation, Dependency Inversion.", "Differentiates good candidates in tier-1 product companies.", "DigitalOcean SOLID Principles", "https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design");
        subjects.add(oop);

        // 5. Data Structures & Algorithms Concepts
        CoreSubject dsa = new CoreSubject("dsa_concept", "Data Structures & Algorithms Concepts", "Theoretical foundations, asymptotic complexities, memory overhead, and algorithm design paradigms.");
        addTopic(dsa, "dsa_asymp", "Asymptotic Analysis & Big-O", "Worst, average, best case, time and space complexity recurrences.", "Essential for analyzing any code during technical interviews.", "GeeksforGeeks Big O Notation", "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/");
        addTopic(dsa, "dsa_arr_str", "Arrays, Strings & Two-Pointers", "Contiguous allocation, sliding window, and two-pointer techniques.", "Most common coding pattern in preliminary rounds.", "GeeksforGeeks Two Pointers", "https://www.geeksforgeeks.org/two-pointers-technique/");
        addTopic(dsa, "dsa_ll", "Linked Lists & Pointer Logic", "Singly, doubly, circular lists, fast & slow pointers, and cycle detection.", "Tests pointer manipulation and edge case handling.", "GeeksforGeeks Linked List", "https://www.geeksforgeeks.org/data-structures/linked-list/");
        addTopic(dsa, "dsa_stk_que", "Stacks, Queues & Monotonic Structures", "LIFO, FIFO, circular queue, deque, and next greater element.", "Applied in parsing, expression evaluation, and buffer systems.", "GeeksforGeeks Stack & Queue", "https://www.geeksforgeeks.org/stack-data-structure/");
        addTopic(dsa, "dsa_tree", "Binary Trees & BST", "Traversals (In/Pre/Post/Level), height, balance, and searching.", "The standard mid-level coding round favorite.", "GeeksforGeeks Binary Tree", "https://www.geeksforgeeks.org/binary-tree-data-structure/");
        addTopic(dsa, "dsa_graph", "Graph Algorithms (BFS, DFS, Dijkstra)", "Adjacency representation, topological sort, shortest paths, and cycles.", "Advanced round favorite in major tech firms.", "GeeksforGeeks Graph Data Structure", "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/");
        addTopic(dsa, "dsa_dp", "Dynamic Programming Paradigms", "Optimal substructure, overlapping subproblems, memoization vs tabulation.", "Crucial for clearing final technical rounds.", "GeeksforGeeks Dynamic Programming", "https://www.geeksforgeeks.org/dynamic-programming/");
        subjects.add(dsa);

        // 6. Computer Organization & Architecture
        CoreSubject coa = new CoreSubject("coa", "Computer Organization & Architecture", "Hardware-software interface, CPU pipelining, and memory hierarchies.");
        addTopic(coa, "coa_inst", "Instruction Formats & Addressing Modes", "Opcode, operands, direct, indirect, immediate, and indexed addressing.", "Standard question in core engineering recruitment tests.", "GeeksforGeeks Addressing Modes", "https://www.geeksforgeeks.org/addressing-modes/");
        addTopic(coa, "coa_pipe", "Pipelining & Hazards", "Instruction execution stages, structural, data, and control hazards.", "High-scoring topic in campus placement tests.", "GeeksforGeeks Pipelining", "https://www.geeksforgeeks.org/pipelining-in-computer-architecture/");
        addTopic(coa, "coa_cache", "Cache Memory & Mapping Techniques", "Direct mapping, associative, set-associative, and hit/miss ratios.", "Frequently tested in system hardware fundamentals.", "GeeksforGeeks Cache Memory", "https://www.geeksforgeeks.org/cache-memory-in-computer-organization/");
        addTopic(coa, "coa_memhier", "Memory Hierarchy & Register Organization", "Registers, SRAM, DRAM, disk storage, access time and latency.", "Broad concept tested in technical aptitude rounds.", "GeeksforGeeks Memory Hierarchy", "https://www.geeksforgeeks.org/memory-hierarchy-design-and-its-characteristics/");
        subjects.add(coa);

        // 7. Software Engineering
        CoreSubject se = new CoreSubject("se", "Software Engineering & Practices", "SDLC methodologies, software testing paradigms, and version control.");
        addTopic(se, "se_sdlc", "SDLC & Agile Methodologies", "Waterfall, Agile, Scrum ceremonies, sprint planning, and user stories.", "Universally asked in behavioral and managerial placement rounds.", "Atlassian Agile Coach", "https://www.atlassian.com/agile");
        addTopic(se, "se_test", "Software Testing & QA", "Unit testing, integration testing, system testing, black-box vs white-box.", "Critical for QA and Software Engineer in Test (SDET) profiles.", "Guru99 Testing Basics", "https://www.guru99.com/software-testing.html");
        addTopic(se, "se_git", "Git & Version Control Workflows", "Branching, merging, rebasing, pull requests, and conflict resolution.", "Tested in practical assignment checks and team fitment rounds.", "Atlassian Git Tutorials", "https://www.atlassian.com/git");
        addTopic(se, "se_api", "RESTful API Design & Best Practices", "HTTP verbs, status codes, idempotency, pagination, and JSON responses.", "Core practical topic for web development and backend roles.", "FreeCodeCamp REST Guide", "https://www.freecodecamp.org/news/rest-api-design-best-practices/");
        subjects.add(se);
    }

    private void addTopic(CoreSubject subject, String id, String name, String desc, String why, String refTitle, String refUrl) {
        CoreTopic topic = new CoreTopic(id, subject.getId(), name, desc, why, refTitle, refUrl);
        subject.getTopics().add(topic);
        topicMap.put(id, topic);
    }

    public List<Map<String, Object>> getSubjectsWithProgress(String userId) {
        Set<String> completedTopics = progressRepository.getCompletedCoreTopics(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (CoreSubject sub : subjects) {
            Map<String, Object> subMap = new HashMap<>();
            subMap.put("id", sub.getId());
            subMap.put("name", sub.getName());
            subMap.put("description", sub.getDescription());

            List<Map<String, Object>> topicList = new ArrayList<>();
            int completedInSubject = 0;
            for (CoreTopic t : sub.getTopics()) {
                Map<String, Object> tMap = t.toMap();
                boolean isCompleted = completedTopics.contains(t.getId());
                tMap.put("completed", isCompleted);
                if (isCompleted) completedInSubject++;
                topicList.add(tMap);
            }
            subMap.put("topics", topicList);
            subMap.put("totalTopics", sub.getTopics().size());
            subMap.put("completedTopics", completedInSubject);
            subMap.put("progressPercentage", sub.getTopics().isEmpty() ? 0 : Math.round(((double) completedInSubject / sub.getTopics().size()) * 100));
            result.add(subMap);
        }
        return result;
    }

    public void toggleTopic(String userId, String topicId, boolean completed) {
        progressRepository.toggleCoreTopic(userId, topicId, completed);
        if (completed && streakService != null) {
            CoreTopic t = topicMap.get(topicId);
            String title = t != null ? t.getName() : topicId;
            streakService.recordActivity(userId, null, "core_cs", "Studied: " + title, "Core CS Preparation");
        }
    }

    public int getTotalTopicCount() {
        return topicMap.size();
    }

    public int getCompletedTopicCount(String userId) {
        return progressRepository.getCompletedCoreTopics(userId).size();
    }

    public List<CoreSubject> getSubjects() {
        return subjects;
    }

    public CoreTopic getTopicById(String id) {
        return topicMap.get(id);
    }
}
