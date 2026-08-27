//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/market_intelligence.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_context.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_drift.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'refresh_fundamentals_response.g.dart';

/// Response from POST /analyses/{id}/refresh-fundamentals — the freshly-fetched fundamental snapshot plus a drift report against the AI's original citations.
///
/// Properties:
/// * [fundamentalContext] 
/// * [refreshedAt] - Server-side timestamp at which the fresh snapshot was captured. Used by the UI to render the 'updated N minutes ago' banner.
/// * [drift] 
/// * [marketState] 
@BuiltValue()
abstract class RefreshFundamentalsResponse implements Built<RefreshFundamentalsResponse, RefreshFundamentalsResponseBuilder> {
  @BuiltValueField(wireName: r'fundamentalContext')
  FundamentalContext get fundamentalContext;

  /// Server-side timestamp at which the fresh snapshot was captured. Used by the UI to render the 'updated N minutes ago' banner.
  @BuiltValueField(wireName: r'refreshedAt')
  DateTime get refreshedAt;

  @BuiltValueField(wireName: r'drift')
  FundamentalDrift get drift;

  @BuiltValueField(wireName: r'marketState')
  MarketIntelligence get marketState;

  RefreshFundamentalsResponse._();

  factory RefreshFundamentalsResponse([void updates(RefreshFundamentalsResponseBuilder b)]) = _$RefreshFundamentalsResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RefreshFundamentalsResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RefreshFundamentalsResponse> get serializer => _$RefreshFundamentalsResponseSerializer();
}

class _$RefreshFundamentalsResponseSerializer implements PrimitiveSerializer<RefreshFundamentalsResponse> {
  @override
  final Iterable<Type> types = const [RefreshFundamentalsResponse, _$RefreshFundamentalsResponse];

  @override
  final String wireName = r'RefreshFundamentalsResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RefreshFundamentalsResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'fundamentalContext';
    yield serializers.serialize(
      object.fundamentalContext,
      specifiedType: const FullType(FundamentalContext),
    );
    yield r'refreshedAt';
    yield serializers.serialize(
      object.refreshedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'drift';
    yield serializers.serialize(
      object.drift,
      specifiedType: const FullType(FundamentalDrift),
    );
    yield r'marketState';
    yield serializers.serialize(
      object.marketState,
      specifiedType: const FullType(MarketIntelligence),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    RefreshFundamentalsResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RefreshFundamentalsResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'fundamentalContext':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(FundamentalContext),
          ) as FundamentalContext;
          result.fundamentalContext.replace(valueDes);
          break;
        case r'refreshedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.refreshedAt = valueDes;
          break;
        case r'drift':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(FundamentalDrift),
          ) as FundamentalDrift;
          result.drift.replace(valueDes);
          break;
        case r'marketState':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MarketIntelligence),
          ) as MarketIntelligence;
          result.marketState.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  RefreshFundamentalsResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RefreshFundamentalsResponseBuilder();
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

