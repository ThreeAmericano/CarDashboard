/*
 * Copyright 2015-2018 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.amqp.tutorials;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @author Gary Russell
 * @author Scott Deeg
 * @author Arnaud Cogoluègnes
 */
@SpringBootApplication
@EnableScheduling
public class RabbitAmqpTutorialsApplication {

	@Profile("usage_message")
	@Bean
	public CommandLineRunner usage() {
		return args -> {
			System.out.println("This app uses Spring Profiles to control its behavior.\n");
			System.out.println("Options are: ");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=hello-world,receiver");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=hello-world,sender");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=work-queues,receiver");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=work-queues,sender");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=pub-sub,receiver");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=pub-sub,sender");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=routing,receiver");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=routing,sender");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=topics,receiver");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=topics,sender");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=rpc,client");
			System.out.println("java -jar rabbit-tutorials.jar --spring.profiles.active=rpc,server");
		};
	}

	@Profile("!usage_message")
	@Bean
	public CommandLineRunner tutorial() {
		return new RabbitAmqpTutorialsRunner();
	}

    public static void main(String[] args) {
        SpringApplication.run(RabbitAmqpTutorialsApplication.class, args);
    }

}
