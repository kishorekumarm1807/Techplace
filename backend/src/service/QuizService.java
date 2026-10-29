package service;

import model.QuizAttempt;
import model.QuizQuestion;
import repository.QuizRepository;

import java.util.*;

public class QuizService {
    private final QuizRepository quizRepository;
    private StreakService streakService;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
        seedQuestionPoolIfEmpty();
    }

    public void setStreakService(StreakService streakService) {
        this.streakService = streakService;
    }

    private void seedQuestionPoolIfEmpty() {
        if (!quizRepository.getAllQuestions().isEmpty()) {
            return;
        }

        List<QuizQuestion> pool = new ArrayList<>();

        // === DBMS Questions ===
        addQ(pool, "dbms_q1", "dbms", "core_cs", "Which normal form deals with removing multi-valued dependencies?",
                List.of("1NF", "2NF", "3NF", "4NF"), 3, "4NF addresses multi-valued dependencies that are not functional dependencies.");
        addQ(pool, "dbms_q2", "dbms", "core_cs", "In ACID properties, what does 'I' stand for?",
                List.of("Integration", "Isolation", "Integrity", "Iteration"), 1, "Isolation ensures that concurrent execution of transactions leaves the database in the same state as if executed serially.");
        addQ(pool, "dbms_q3", "dbms", "core_cs", "Which SQL clause is used to filter records after aggregation with GROUP BY?",
                List.of("WHERE", "HAVING", "FILTER", "ORDER BY"), 1, "The HAVING clause was added to SQL because the WHERE keyword cannot be used with aggregate functions.");
        addQ(pool, "dbms_q4", "dbms", "core_cs", "What type of index alters the physical storage order of rows in a table?",
                List.of("Clustered Index", "Non-clustered Index", "Bitmap Index", "Unique Secondary Index"), 0, "A clustered index defines the physical order in which data is stored in the table.");
        addQ(pool, "dbms_q5", "dbms", "core_cs", "Which lock allows concurrent transactions to read data but not update it?",
                List.of("Exclusive Lock (X)", "Shared Lock (S)", "Two-Phase Lock", "Intent Exclusive Lock"), 1, "Shared locks (S) permit concurrent transactions to read (SELECT) a resource but not modify it.");
        addQ(pool, "dbms_q6", "dbms", "core_cs", "Which relational algebra operation combines rows from two tables based on a related column?",
                List.of("Projection", "Selection", "Join", "Cartesian Product"), 2, "A Join operation merges tuples from two relations satisfying a specified join condition.");
        addQ(pool, "dbms_q7", "dbms", "core_cs", "What is the primary objective of Database Normalization?",
                List.of("Increase disk usage", "Eliminate data redundancy & anomalies", "Encrypt user passwords", "Speed up table scans"), 1, "Normalization organizes database tables to minimize redundancy and avoid insertion, deletion, and update anomalies.");
        addQ(pool, "dbms_q8", "dbms", "core_cs", "In B+ Trees used in databases, where are data pointers actually stored?",
                List.of("Only in root node", "In all internal nodes", "Only in leaf nodes", "Distributed randomly"), 2, "In B+ trees, data records or pointers are solely stored in the leaf nodes, connected as a linked list for fast range queries.");
        addQ(pool, "dbms_q9", "dbms", "core_cs", "A super key with no redundant attributes is called a:",
                List.of("Foreign Key", "Candidate Key", "Surrogate Key", "Composite Index"), 1, "A candidate key is a minimal super key having no extraneous attributes.");
        addQ(pool, "dbms_q10", "dbms", "core_cs", "Which transaction isolation level prevents Dirty Reads but permits Non-repeatable Reads?",
                List.of("Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"), 1, "Read Committed ensures only committed data is read, avoiding dirty reads.");
        addQ(pool, "dbms_q11", "dbms", "core_cs", "What does the TRUNCATE command do compared to DELETE?",
                List.of("Deletes rows without dropping table, resetting identity, and is non-rollbackable in some DBs", "Deletes database schema", "Only modifies column datatypes", "Replaces NULL with zero"), 0, "TRUNCATE is a DDL operation that empties a table completely and typically executes faster than DELETE.");
        addQ(pool, "dbms_q12", "dbms", "core_cs", "Which phase of Two-Phase Locking (2PL) releases acquired locks?",
                List.of("Growing Phase", "Shrinking Phase", "Waiting Phase", "Deadlock Phase"), 1, "In the shrinking phase of 2PL, locks are only released and no new locks can be acquired.");
        addQ(pool, "dbms_q13", "dbms", "core_cs", "Which constraint ensures that child table values exist in the parent table?",
                List.of("PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "CHECK"), 1, "A FOREIGN KEY enforces referential integrity between two tables.");
        addQ(pool, "dbms_q14", "dbms", "core_cs", "What is the time complexity of searching a record using a B+ tree index?",
                List.of("O(1)", "O(log N)", "O(N)", "O(N log N)"), 1, "Searching a balanced B+ tree takes logarithmic time O(log N).");
        addQ(pool, "dbms_q15", "dbms", "core_cs", "Which SQL keyword eliminates duplicate rows from query output?",
                List.of("UNIQUE", "DISTINCT", "DIFFERENT", "REMOVE_DUPLICATES"), 1, "The SELECT DISTINCT statement is used to return only distinct (different) values.");

        // === Operating Systems Questions ===
        addQ(pool, "os_q1", "os", "core_cs", "Which state transition is NOT valid in a standard process lifecycle?",
                List.of("Ready -> Running", "Running -> Blocked/Waiting", "Blocked/Waiting -> Running", "Blocked/Waiting -> Ready"), 2, "A blocked process must first enter the Ready state before the CPU scheduler can dispatch it to Running.");
        addQ(pool, "os_q2", "os", "core_cs", "Which CPU scheduling algorithm is completely free from starvation?",
                List.of("Shortest Job First (SJF)", "Priority Scheduling", "Round Robin", "Shortest Remaining Time First"), 2, "Round Robin uses time slices (quanta) guaranteeing every ready process fair execution without starvation.");
        addQ(pool, "os_q3", "os", "core_cs", "Which condition is NOT one of the 4 necessary Coffman conditions for deadlock?",
                List.of("Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"), 2, "No preemption is the condition. Allowing preemption prevents or breaks deadlock.");
        addQ(pool, "os_q4", "os", "core_cs", "What hardware component translates virtual addresses to physical addresses?",
                List.of("ALU", "Memory Management Unit (MMU)", "DMA Controller", "Bus Arbiter"), 1, "The MMU hardware unit handles virtual-to-physical address translation via page tables.");
        addQ(pool, "os_q5", "os", "core_cs", "What is the phenomenon where adding more page frames increases page faults in FIFO?",
                List.of("Thrashing", "Belady's Anomaly", "Cache Coherence", "Convoy Effect"), 1, "Belady's Anomaly is the counter-intuitive situation where increasing page frames leads to more page faults in FIFO page replacement.");
        addQ(pool, "os_q6", "os", "core_cs", "What is the main advantage of user-level threads over kernel-level threads?",
                List.of("Fast context switching without kernel trap", "True multicore parallel execution", "Better hardware fault tolerance", "Direct hardware interrupt handling"), 0, "User-level threads can switch contexts in user space without incurring the overhead of a system call or kernel mode switch.");
        addQ(pool, "os_q7", "os", "core_cs", "Which algorithm is used in Operating Systems for deadlock avoidance?",
                List.of("Dijkstra's Algorithm", "Banker's Algorithm", "Kruskal's Algorithm", "Dekker's Algorithm"), 1, "Banker's Algorithm tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources.");
        addQ(pool, "os_q8", "os", "core_cs", "What is 'Thrashing' in an Operating System?",
                List.of("High CPU utilization with zero I/O", "Excessive paging activity where OS spends more time swapping than executing", "Deadlock between multiple CPU cores", "Hard disk failure"), 1, "Thrashing occurs when the system spends more time paging data in and out than executing instructions.");
        addQ(pool, "os_q9", "os", "core_cs", "What does a counting semaphore initialized to value N represent?",
                List.of("N available units of a shared resource", "A binary mutex", "Number of CPU cores", "System boot counter"), 0, "A counting semaphore initialized to N manages access to a pool of N identical resources.");
        addQ(pool, "os_q10", "os", "core_cs", "In Unix/Linux, which system call creates a new child process?",
                List.of("exec()", "fork()", "pthread_create()", "wait()"), 1, "fork() creates a new process by duplicating the calling process.");
        addQ(pool, "os_q11", "os", "core_cs", "What is the primary cause of internal fragmentation in memory?",
                List.of("Dynamic variable-sized partitions", "Fixed-size page allocation exceeding required process bytes", "Deadlocks", "High network latency"), 1, "Internal fragmentation occurs when allocated storage is larger than requested storage, such as the last page in paging.");
        addQ(pool, "os_q12", "os", "core_cs", "Which disk scheduling algorithm selects requests with minimum seek time from current head?",
                List.of("FCFS", "SSTF (Shortest Seek Time First)", "SCAN", "C-LOOK"), 1, "SSTF selects the disk I/O request with the minimum seek distance from the current head position.");
        addQ(pool, "os_q13", "os", "core_cs", "What is a 'Zombie' process in Unix?",
                List.of("A process consuming 100% CPU", "A terminated process whose parent has not yet called wait()", "A kernel background daemon", "A swapped out process"), 1, "A zombie process has finished execution but still has an entry in the process table because its exit status is yet to be read by the parent.");
        addQ(pool, "os_q14", "os", "core_cs", "What is the Translation Lookaside Buffer (TLB)?",
                List.of("A hardware cache for virtual-to-physical page table translations", "A disk cache for file blocks", "A queue of ready processes", "A stack buffer for local variables"), 0, "The TLB is a high-speed associative hardware cache that speeds up virtual address translation by caching page table entries.");

        // === Computer Networks Questions ===
        addQ(pool, "cn_q1", "cn", "core_cs", "Which layer of the OSI model is responsible for end-to-end reliable transmission and flow control?",
                List.of("Network Layer", "Data Link Layer", "Transport Layer", "Session Layer"), 2, "The Transport Layer (TCP) manages end-to-end communication, segmentation, flow control, and error recovery.");
        addQ(pool, "cn_q2", "cn", "core_cs", "Which flags are exchanged during the TCP 3-way handshake?",
                List.of("SYN -> SYN-ACK -> ACK", "ACK -> SYN -> SYN-ACK", "SYN -> ACK -> FIN", "RST -> SYN -> ACK"), 0, "TCP establishes a connection using SYN, SYN-ACK, and ACK flags.");
        addQ(pool, "cn_q3", "cn", "core_cs", "What is the default port number for HTTPS?",
                List.of("80", "8080", "443", "22"), 2, "HTTPS uses port 443 by default for encrypted web traffic.");
        addQ(pool, "cn_q4", "cn", "core_cs", "What protocol is used to map an IP address to a physical MAC address on a local network?",
                List.of("DNS", "ARP", "DHCP", "ICMP"), 1, "Address Resolution Protocol (ARP) translates 32-bit IPv4 addresses into 48-bit MAC addresses.");
        addQ(pool, "cn_q5", "cn", "core_cs", "Which transport layer protocol does DNS primarily use for standard name resolution queries?",
                List.of("TCP", "UDP", "SCTP", "ICMP"), 1, "Standard DNS queries typically use UDP port 53 because it is lightweight and low-latency.");
        addQ(pool, "cn_q6", "cn", "core_cs", "What is the maximum number of usable host addresses in a /24 IPv4 subnet?",
                List.of("256", "254", "255", "128"), 1, "A /24 subnet has 2^(32-24) = 256 addresses, minus 2 (network and broadcast addresses) = 254 hosts.");
        addQ(pool, "cn_q7", "cn", "core_cs", "Which HTTP status code signifies 'Unauthorized'?",
                List.of("400", "401", "403", "404"), 1, "401 indicates the request lacks valid authentication credentials for the target resource.");
        addQ(pool, "cn_q8", "cn", "core_cs", "Which routing protocol uses Dijkstra's algorithm to compute shortest paths?",
                List.of("RIP", "BGP", "OSPF", "EGP"), 2, "Open Shortest Path First (OSPF) uses Dijkstra's link-state algorithm to calculate the loop-free shortest path tree.");
        addQ(pool, "cn_q9", "cn", "core_cs", "What is the purpose of the TTL (Time to Live) field in an IPv4 packet header?",
                List.of("Record packet creation timestamp", "Prevent packets from looping endlessly in networks", "Enforce encryption duration", "Limit connection speed"), 1, "TTL is decremented by each router; when it hits 0, the packet is discarded and an ICMP Time Exceeded is returned.");
        addQ(pool, "cn_q10", "cn", "core_cs", "Which of the following is an idempotent HTTP method?",
                List.of("POST", "PUT", "CONNECT", "PATCH (non-standard)"), 1, "PUT is idempotent; making multiple identical requests has the same effect as making a single request.");
        addQ(pool, "cn_q11", "cn", "core_cs", "What protocol does Ping utility use to test host reachability?",
                List.of("TCP", "UDP", "ICMP", "IGMP"), 2, "Ping uses ICMP Echo Request and Echo Reply messages.");
        addQ(pool, "cn_q12", "cn", "core_cs", "Which protocol dynamically assigns IP addresses to devices on a network?",
                List.of("DNS", "DHCP", "SNMP", "NTP"), 1, "Dynamic Host Configuration Protocol (DHCP) automatically assigns IP configuration to network clients.");

        // === OOP Questions ===
        addQ(pool, "oop_q1", "oop", "core_cs", "Which OOP concept involves binding data and the methods that manipulate that data into a single unit?",
                List.of("Inheritance", "Polymorphism", "Encapsulation", "Abstraction"), 2, "Encapsulation is the bundling of data and the methods that operate on that data, restricting direct access from outside.");
        addQ(pool, "oop_q2", "oop", "core_cs", "In Java, what happens if a class does not define any constructor?",
                List.of("The class cannot be instantiated", "Compiler provides a default no-argument constructor", "Runtime error occurs", "All variables become static"), 1, "If no explicit constructor is provided, the Java compiler automatically generates a public no-arg default constructor.");
        addQ(pool, "oop_q3", "oop", "core_cs", "Which OOP feature allows a subclass to provide a specific implementation of a method already defined in its superclass?",
                List.of("Method Overloading", "Method Overriding", "Method Shadowing", "Constructor Chaining"), 1, "Method Overriding allows runtime polymorphism where a subclass redefines a method with identical signature.");
        addQ(pool, "oop_q4", "oop", "core_cs", "Which of the following violates the Liskov Substitution Principle (LSP)?",
                List.of("A subclass strengthens preconditions", "A subclass extends base behavior without modifying invariants", "A subclass can be used anywhere base class is expected", "A subclass implements an interface"), 0, "LSP requires that subtypes must be substitutable for their base types; strengthening preconditions in a subtype breaks this expectation.");
        addQ(pool, "oop_q5", "oop", "core_cs", "What is the Diamond Problem in Object-Oriented Programming?",
                List.of("Memory leak in linked lists", "Ambiguity arising from multiple inheritance when two parent classes inherit from the same grandparent", "Circular dependency between packages", "Recursive constructor invocation"), 1, "The Diamond Problem occurs in multiple inheritance when a class inherits from two classes that both inherit from a single base class, causing ambiguous method resolution.");
        addQ(pool, "oop_q6", "oop", "core_cs", "Can an abstract class in Java have concrete methods and instance variables?",
                List.of("No, abstract classes only contain method declarations", "Yes, abstract classes can have state and implemented methods", "Only static methods are allowed", "Only final variables are allowed"), 1, "Unlike pure interfaces (historically), abstract classes can maintain state (instance variables) and implement concrete methods.");
        addQ(pool, "oop_q7", "oop", "core_cs", "Which keyword prevents a method from being overridden in Java?",
                List.of("static", "final", "const", "abstract"), 1, "The 'final' keyword on a method prevents subclasses from overriding it.");
        addQ(pool, "oop_q8", "oop", "core_cs", "What type of polymorphism is method overloading?",
                List.of("Runtime Polymorphism", "Compile-time (Static) Polymorphism", "Coercion Polymorphism", "Subtyping"), 1, "Method overloading is resolved at compile time based on parameter types and counts.");
        addQ(pool, "oop_q9", "oop", "core_cs", "Which design pattern ensures that a class has only one instance and provides a global point of access to it?",
                List.of("Factory Pattern", "Singleton Pattern", "Observer Pattern", "Adapter Pattern"), 1, "The Singleton pattern restricts class instantiation to a single object instance.");
        addQ(pool, "oop_q10", "oop", "core_cs", "What is the main purpose of the 'super' keyword in Java?",
                List.of("Call methods and constructors of the parent class", "Declare a global constant", "Override access specifiers", "Terminate execution"), 0, "The 'super' keyword refers to the immediate parent class object and is used to invoke superclass constructors and methods.");

        // === DSA Concepts Questions ===
        addQ(pool, "dsa_q1", "dsa_concept", "core_cs", "What is the average time complexity of searching in a Hash Table with good hash distribution?",
                List.of("O(log N)", "O(1)", "O(N)", "O(N log N)"), 1, "Hash table lookups average O(1) constant time when collisions are minimal.");
        addQ(pool, "dsa_q2", "dsa_concept", "core_cs", "Which data structure is best suited for implementing a Breadth-First Search (BFS)?",
                List.of("Stack", "Queue", "Priority Queue", "Binary Search Tree"), 1, "Queue (FIFO) is standard for BFS to visit nodes level-by-level.");
        addQ(pool, "dsa_q3", "dsa_concept", "core_cs", "What is the worst-case time complexity of QuickSort?",
                List.of("O(N log N)", "O(N)", "O(N^2)", "O(log N)"), 2, "QuickSort degrades to O(N^2) when the pivot choice is consistently the smallest or largest element (e.g. already sorted array without random pivot).");
        addQ(pool, "dsa_q4", "dsa_concept", "core_cs", "What algorithm detects a cycle in a linked list in O(N) time and O(1) space?",
                List.of("Kadane's Algorithm", "Floyd's Tortoise and Hare (Slow & Fast Pointers)", "Tarjan's Algorithm", "Kruskal's Algorithm"), 1, "Floyd's Cycle Finding algorithm uses slow and fast pointers to detect cycles without extra memory.");
        addQ(pool, "dsa_q5", "dsa_concept", "core_cs", "Which traversal of a Binary Search Tree (BST) visits keys in sorted ascending order?",
                List.of("Preorder", "Inorder", "Postorder", "Level-order"), 1, "An Inorder traversal (Left, Root, Right) of a BST produces elements in strictly ascending sorted order.");
        addQ(pool, "dsa_q6", "dsa_concept", "core_cs", "What is the height of a balanced binary tree with N nodes?",
                List.of("O(1)", "O(log N)", "O(N)", "O(N log N)"), 1, "A balanced binary tree with N nodes has height O(log N).");
        addQ(pool, "dsa_q7", "dsa_concept", "core_cs", "Which algorithm is used to find Single-Source Shortest Paths in a graph with non-negative edge weights?",
                List.of("Prim's Algorithm", "Dijkstra's Algorithm", "Floyd-Warshall", "Bellman-Ford"), 1, "Dijkstra's algorithm greedily finds shortest paths from a source to all other vertices in non-negative weighted graphs.");
        addQ(pool, "dsa_q8", "dsa_concept", "core_cs", "What two properties must a problem have to be solvable by Dynamic Programming?",
                List.of("Greedy choice & divide-and-conquer", "Optimal substructure & overlapping subproblems", "Linearity & recursion", "Sorting & hashing"), 1, "Dynamic programming requires overlapping subproblems (avoiding redundant calculations) and optimal substructure (optimal solution composed of optimal sub-solutions).");

        // === Aptitude Questions (across the 16 topics) ===
        addQ(pool, "apt_q1", "apt_numbers", "aptitude", "What is the unit digit in the product (784 * 618 * 917 * 463)?",
                List.of("2", "4", "6", "8"), 0, "Unit digits are 4, 8, 7, 3. (4 * 8) = 32 (unit 2); (2 * 7) = 14 (unit 4); (4 * 3) = 12 (unit 2).");
        addQ(pool, "apt_q2", "apt_numbers", "aptitude", "The sum of the first 50 natural numbers is:",
                List.of("1225", "1275", "1250", "1300"), 1, "Sum = n(n+1)/2 = 50 * 51 / 2 = 1275.");
        addQ(pool, "apt_q3", "apt_divisibility", "aptitude", "A number is divisible by 9 if and only if:",
                List.of("Its last digit is 9", "The sum of its digits is divisible by 9", "It is divisible by both 3 and 6", "Its last two digits are divisible by 9"), 1, "A number is divisible by 9 if the sum of its individual digits is a multiple of 9.");
        addQ(pool, "apt_q4", "apt_hcf_lcm", "aptitude", "The HCF and LCM of two numbers are 12 and 336 respectively. If one number is 84, find the other:",
                List.of("36", "48", "54", "64"), 1, "Product of numbers = HCF * LCM. Other number = (12 * 336) / 84 = 4032 / 84 = 48.");
        addQ(pool, "apt_q5", "apt_series", "aptitude", "Find the 10th term of the AP: 3, 7, 11, 15, ...",
                List.of("35", "39", "41", "43"), 1, "Tn = a + (n-1)d = 3 + (10-1)*4 = 3 + 36 = 39.");
        addQ(pool, "apt_q6", "apt_ratio_prop", "aptitude", "If A:B = 2:3 and B:C = 4:5, what is A:B:C?",
                List.of("8:12:15", "6:9:15", "4:6:10", "8:10:15"), 0, "Multiply first ratio by 4 and second by 3: A:B = 8:12, B:C = 12:15 -> A:B:C = 8:12:15.");
        addQ(pool, "apt_q7", "apt_time_work", "aptitude", "A can finish a task in 10 days and B in 15 days. How long will they take working together?",
                List.of("5 days", "6 days", "7.5 days", "8 days"), 1, "Combined 1-day work = 1/10 + 1/15 = 5/30 = 1/6. Total days = 6 days.");
        addQ(pool, "apt_q8", "apt_profit_loss", "aptitude", "An item purchased for Rs. 500 is sold for Rs. 650. What is the profit percentage?",
                List.of("25%", "30%", "20%", "35%"), 1, "Profit = 650 - 500 = 150. Profit % = (150/500) * 100 = 30%.");
        addQ(pool, "apt_q9", "apt_percentage", "aptitude", "If A's salary is 25% more than B's salary, then B's salary is what % less than A's?",
                List.of("20%", "25%", "16.66%", "33.33%"), 0, "Formula: [r / (100 + r)] * 100 = [25 / 125] * 100 = 20%.");
        addQ(pool, "apt_q10", "apt_speed_dist", "aptitude", "A train 150 m long crosses a pole in 10 seconds. What is its speed in km/h?",
                List.of("45 km/h", "54 km/h", "60 km/h", "72 km/h"), 1, "Speed in m/s = 150 / 10 = 15 m/s. In km/h = 15 * (18/5) = 54 km/h.");
        addQ(pool, "apt_q11", "apt_simple_int", "aptitude", "Find the simple interest on Rs. 8000 at 5% per annum for 3 years:",
                List.of("Rs. 1000", "Rs. 1200", "Rs. 1400", "Rs. 1500"), 1, "SI = (P * R * T) / 100 = (8000 * 5 * 3) / 100 = 1200.");
        addQ(pool, "apt_q12", "apt_compound_int", "aptitude", "What is the compound interest on Rs. 10,000 at 10% per annum compounded annually for 2 years?",
                List.of("Rs. 2000", "Rs. 2100", "Rs. 2200", "Rs. 2500"), 1, "Amount = 10000 * (1.1)^2 = 12100. CI = 12100 - 10000 = 2100.");
        addQ(pool, "apt_q13", "apt_probability", "aptitude", "What is the probability of getting a sum of 7 when rolling two standard 6-sided dice?",
                List.of("1/6", "1/12", "5/36", "7/36"), 0, "Favorable outcomes: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6. Total = 36. Probability = 6/36 = 1/6.");
        addQ(pool, "apt_q14", "apt_perm_comb", "aptitude", "In how many ways can the letters of the word 'LEADER' be arranged?",
                List.of("720", "360", "120", "480"), 1, "Word has 6 letters with 'E' repeating twice: 6! / 2! = 720 / 2 = 360.");
        addQ(pool, "apt_q15", "apt_mix_all", "aptitude", "In what ratio must tea at Rs. 62/kg be mixed with tea at Rs. 72/kg so that the mixture is worth Rs. 64.50/kg?",
                List.of("3:1", "3:2", "4:3", "5:3"), 0, "By alligation: (72 - 64.5) : (64.5 - 62) = 7.5 : 2.5 = 3 : 1.");
        addQ(pool, "apt_q16", "apt_pipes_cist", "aptitude", "Pipe A fills a tank in 6 hours and Pipe B empties it in 8 hours. If both open, how long to fill?",
                List.of("12 hours", "18 hours", "24 hours", "30 hours"), 2, "Net rate = 1/6 - 1/8 = (4 - 3)/24 = 1/24. Tank fills in 24 hours.");

        quizRepository.addQuestions(pool);
    }

    private void addQ(List<QuizQuestion> list, String id, String topicId, String type, String q, List<String> opts, int correctIdx, String expl) {
        list.add(new QuizQuestion(id, topicId, type, q, opts, correctIdx, expl));
    }

    public List<Map<String, Object>> generateQuizSession(String topicOrType) {
        List<QuizQuestion> candidates;
        if ("core_cs".equalsIgnoreCase(topicOrType) || "aptitude".equalsIgnoreCase(topicOrType)) {
            candidates = quizRepository.getQuestionsByType(topicOrType);
        } else {
            candidates = quizRepository.getQuestionsByTopic(topicOrType);
            if (candidates.isEmpty()) {
                candidates = quizRepository.getQuestionsByType(topicOrType.startsWith("apt") ? "aptitude" : "core_cs");
            }
        }

        if (candidates.isEmpty()) {
            candidates = quizRepository.getAllQuestions();
        }

        List<QuizQuestion> shuffled = new ArrayList<>(candidates);
        Collections.shuffle(shuffled);

        int count = Math.min(10, shuffled.size());
        List<Map<String, Object>> sessionQuestions = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            sessionQuestions.add(shuffled.get(i).toMap(false)); // Do not include correct answer!
        }
        return sessionQuestions;
    }

    public Map<String, Object> evaluateQuiz(String userId, String topicId, String topicName, String type, Map<String, Integer> userAnswers) {
        int score = 0;
        int total = userAnswers.size();
        List<Map<String, Object>> breakdown = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : userAnswers.entrySet()) {
            String qId = entry.getKey();
            int selected = entry.getValue();
            Optional<QuizQuestion> opt = quizRepository.getQuestionById(qId);

            Map<String, Object> item = new HashMap<>();
            item.put("questionId", qId);
            item.put("userSelected", selected);

            if (opt.isPresent()) {
                QuizQuestion q = opt.get();
                boolean isCorrect = (selected == q.getCorrectOptionIndex());
                if (isCorrect) score++;

                item.put("question", q.getQuestion());
                item.put("options", q.getOptions());
                item.put("correctOptionIndex", q.getCorrectOptionIndex());
                item.put("isCorrect", isCorrect);
                item.put("explanation", q.getExplanation());
            } else {
                item.put("isCorrect", false);
            }
            breakdown.add(item);
        }

        int attemptNumber = quizRepository.getAttemptCountForTopic(userId, topicId) + 1;
        String attemptId = "att_" + UUID.randomUUID().toString().substring(0, 8);
        QuizAttempt attempt = new QuizAttempt(attemptId, userId, topicId, topicName, type, score, total, attemptNumber);
        quizRepository.recordAttempt(attempt);

        if (streakService != null) {
            streakService.recordActivity(userId, null, "quiz", "Completed Quiz: " + topicName, score + "/" + total + " correct");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("attemptId", attemptId);
        response.put("score", score);
        response.put("totalQuestions", total);
        response.put("percentage", total > 0 ? Math.round(((double) score / total) * 100) : 0);
        response.put("attemptNumber", attemptNumber);
        response.put("breakdown", breakdown);
        return response;
    }

    public List<Map<String, Object>> getUserAttempts(String userId) {
        List<QuizAttempt> attempts = quizRepository.getAttemptsByUser(userId);
        List<Map<String, Object>> list = new ArrayList<>();
        for (QuizAttempt a : attempts) {
            list.add(a.toMap());
        }
        return list;
    }
}
