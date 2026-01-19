import { useQuery } from "@tanstack/react-query";
import { ThreadDetail } from "../types";
import { GetSummaryListV5V1SummaryGetParams } from "src/lib/api-v1/query/useGetSummaryListV5V1SummaryGetQuery";

const mockThreadDetail: ThreadDetail = {
  id: "thread_001",
  title: "오늘 시장 요약",
  createdAt: "2026-01-19T09:00:00Z",
  updatedAt: "2026-01-19T09:06:30Z",

  messages: [
    // 1️⃣ Human 질문
    {
      type: "human",
      data: {
        id: "msg_human_001",
        content: "오늘 국내 증시 주요 이슈 요약해줘",
      },
    },

    // 2️⃣ AI - 분석 시작 + 툴 호출
    {
      type: "ai",
      data: {
        id: "msg_ai_001",
        content: [
          {
            text: "최신 증시 뉴스를 바탕으로 오늘 시장 흐름을 분석하겠습니다.",
          },
        ],
        tool_calls: [
          {
            id: "tool_call_001",
            type: "tool_call",
            name: "search_market_news",
            args: {
              market: "KOSPI",
              date: "2026-01-19",
            },
          },
        ],
        response_metadata: {
          model: "gpt-4.1",
        },
      },
    },

    // 3️⃣ Tool 실행 결과
    {
      type: "tool",
      data: {
        id: "msg_tool_001",
        tool_call_id: "tool_call_001",
        name: "search_market_news",
        status: "success",
        content:
          "삼성전자·SK하이닉스 강세, 로봇·원전 테마 상승. 코스피 4800선 근접.",
        artifact: [
          {
            title: "현대차, 피지컬 AI 기대감에 신고가",
            url: "https://www.mk.co.kr/news/stock/11936677",
          },
        ],
      },
    },

    // 4️⃣ AI - 최종 답변
    {
      type: "ai",
      data: {
        id: "msg_ai_002",
        content:
          "오늘 국내 증시는 반도체 대형주와 로봇·원전 테마가 상승을 주도했습니다. 삼성전자와 SK하이닉스가 강세를 보이며 코스피는 4800선에 근접했습니다.",
        response_metadata: {
          model: "gpt-4.1",
          finish_reason: "stop",
        },
      },
    },

    // 5️⃣ Human - 후속 질문
    {
      type: "human",
      data: {
        id: "msg_human_002",
        content: "그중에서 반도체 관련주 전망은 어때?",
      },
    },

    // 6️⃣ AI - 단일 응답 (툴 없이)
    {
      type: "ai",
      data: {
        id: "msg_ai_003",
        content:
          "반도체 업종은 AI 수요 증가와 메모리 가격 회복 기대감으로 중장기적인 긍정 전망이 유지되고 있습니다. 다만 단기적으로는 차익 실현 가능성도 함께 고려할 필요가 있습니다.",
        response_metadata: {
          model: "gpt-4.1",
        },
      },
    }, // 6️⃣ AI - 단일 응답 (툴 없이)
    {
      type: "ai",
      data: {
        id: "msg_ai_004",
        content:
          "반도체 업종은 AI 수요 증가와 메모리 가격 회복 기대감으로 중장기적인 긍정 전망이 유지되고 있습니다. 다만 단기적으로는 차익 실현 가능성도 함께 고려할 필요가 있습니다.",
        response_metadata: {
          model: "gpt-4.1",
        },
      },
    }, // 6️⃣ AI - 단일 응답 (툴 없이)
    {
      type: "ai",
      data: {
        id: "msg_ai_005",
        content:
          "반도체 업종은 AI 수요 증가와 메모리 가격 회복 기대감으로 중장기적인 긍정 전망이 유지되고 있습니다. 다만 단기적으로는 차익 실현 가능성도 함께 고려할 필요가 있습니다.",
        response_metadata: {
          model: "gpt-4.1",
        },
      },
    },
  ],
};

const ENDPOINT = "/api/agent/thread-detail";
interface ThreadDetailParams {
  threadId: string;
}
const getThreadDetailQueryKey = (
  params?: ThreadDetailParams,
): readonly unknown[] => (params ? [ENDPOINT, params] : [ENDPOINT]);

function useGetThreadDetail({ threadId }: ThreadDetailParams) {
  const query = useQuery({
    queryKey: getThreadDetailQueryKey({ threadId }),
    queryFn: async () => {
      // In real implementation, fetch from API
      return mockThreadDetail;
    },
  });

  return { data: query.data, isLoading: query.isLoading, error: query.error };
}

export { useGetThreadDetail, getThreadDetailQueryKey };
