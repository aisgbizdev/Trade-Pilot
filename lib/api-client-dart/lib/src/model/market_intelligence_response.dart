//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/fundamental_news_source.dart';
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/market_intelligence.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'market_intelligence_response.g.dart';

/// MarketIntelligenceResponse
///
/// Properties:
/// * [marketState] 
/// * [sourceStatuses] 
/// * [refreshedAt] 
@BuiltValue()
abstract class MarketIntelligenceResponse implements Built<MarketIntelligenceResponse, MarketIntelligenceResponseBuilder> {
  @BuiltValueField(wireName: r'marketState')
  MarketIntelligence get marketState;

  @BuiltValueField(wireName: r'sourceStatuses')
  BuiltList<FundamentalNewsSource> get sourceStatuses;

  @BuiltValueField(wireName: r'refreshedAt')
  DateTime get refreshedAt;

  MarketIntelligenceResponse._();

  factory MarketIntelligenceResponse([void updates(MarketIntelligenceResponseBuilder b)]) = _$MarketIntelligenceResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MarketIntelligenceResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MarketIntelligenceResponse> get serializer => _$MarketIntelligenceResponseSerializer();
}

class _$MarketIntelligenceResponseSerializer implements PrimitiveSerializer<MarketIntelligenceResponse> {
  @override
  final Iterable<Type> types = const [MarketIntelligenceResponse, _$MarketIntelligenceResponse];

  @override
  final String wireName = r'MarketIntelligenceResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MarketIntelligenceResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'marketState';
    yield serializers.serialize(
      object.marketState,
      specifiedType: const FullType(MarketIntelligence),
    );
    yield r'sourceStatuses';
    yield serializers.serialize(
      object.sourceStatuses,
      specifiedType: const FullType(BuiltList, [FullType(FundamentalNewsSource)]),
    );
    yield r'refreshedAt';
    yield serializers.serialize(
      object.refreshedAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MarketIntelligenceResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MarketIntelligenceResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'marketState':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MarketIntelligence),
          ) as MarketIntelligence;
          result.marketState.replace(valueDes);
          break;
        case r'sourceStatuses':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(FundamentalNewsSource)]),
          ) as BuiltList<FundamentalNewsSource>;
          result.sourceStatuses.replace(valueDes);
          break;
        case r'refreshedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.refreshedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MarketIntelligenceResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MarketIntelligenceResponseBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

