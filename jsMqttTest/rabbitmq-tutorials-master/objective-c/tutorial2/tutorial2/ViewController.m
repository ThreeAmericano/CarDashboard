#import "ViewController.h"
@import RMQClient;

@interface ViewController ()
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self workerNamed:@"Jack"];
    [self workerNamed:@"Jill"];
    sleep(1);
    [self newTask:@"Hello World..."];
    [self newTask:@"Just one this time."];
    [self newTask:@"Five....."];
    [self newTask:@"None"];
    [self newTask:@"Two..dots"];
}

- (void)newTask:(NSString *)msg {
    RMQConnection *conn = [[RMQConnection alloc] initWithDelegate:[RMQConnectionDelegateLogger new]];
    [conn start];

    id<RMQChannel> ch = [conn createChannel];

    RMQQueue *q = [ch queue:@"task_queue" options:RMQQueueDeclareDurable];

    NSData *msgData = [msg dataUsingEncoding:NSUTF8StringEncoding];
    [ch.defaultExchange publish:msgData routingKey:q.name persistent:YES];
    NSLog(@"Sent %@", msg);

    [NSThread sleepForTimeInterval:2.0f];
    [conn close];
}

- (void)workerNamed:(NSString *)name {
    RMQConnection *conn = [[RMQConnection alloc] initWithDelegate:[RMQConnectionDelegateLogger new]];
    [conn start];

    id<RMQChannel> ch = [conn createChannel];

    RMQQueue *q = [ch queue:@"task_queue" options:RMQQueueDeclareDurable];

    [ch basicQos:@1 global:NO];
    NSLog(@"%@: Waiting for messages", name);

    RMQBasicConsumeOptions manualAck = RMQBasicConsumeNoOptions;
    [q subscribe:manualAck handler:^(RMQMessage * _Nonnull message) {
        NSString *messageText = [[NSString alloc] initWithData:message.body encoding:NSUTF8StringEncoding];
        NSLog(@"%@: Received %@", name, messageText);
        // imitate some work
        unsigned int sleepTime = (unsigned int)[messageText componentsSeparatedByString:@"."].count - 1;
        NSLog(@"%@: Sleeping for %u seconds", name, sleepTime);
        sleep(sleepTime);

        [ch ack:message.deliveryTag];
    }];
}

@end
