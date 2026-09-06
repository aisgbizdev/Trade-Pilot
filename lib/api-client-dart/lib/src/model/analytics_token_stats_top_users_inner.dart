//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_token_stats_top_users_inner.g.dart';

/// AnalyticsTokenStatsTopUsersInner
///
/// Properties:
/// * [userId] 
/// * [email] 
/// * [totalTokens] 
/// * [estimatedCostUsd] 
@BuiltValue()
abstract class AnalyticsTokenStatsTopUsersInner implements Built<AnalyticsTokenStatsTopUsersInner, AnalyticsTokenStatsTopUsersInnerBuilder> {
  @BuiltValueField(wireName: r'userId')
  int get userId;

  @BuiltValueField(wireName: r'email')
  String get email;

  @BuiltValueField(wireName: r'totalTokens')
  int get totalTokens;

  @BuiltValueField(wireName: r'estimatedCostUsd')
  num get estimatedCostUsd;

  AnalyticsTokenStatsTopUsersInner._();

  factory AnalyticsTokenStatsTopUsersInner([void updates(AnalyticsTokenStatsTopUsersInnerBuilder b)]) = _$AnalyticsTokenStatsTopUsersInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsTokenStatsTopUsersInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsTokenStatsTopUsersInner> get serializer => _$AnalyticsTokenStatsTopUsersInnerSerializer();
}

class _$AnalyticsTokenStatsTopUsersInnerSerializer implements PrimitiveSerializer<AnalyticsTokenStatsTopUsersInner> {
  @override
  final Iterable<Type> types = const [AnalyticsTokenStatsTopUsersInner, _$AnalyticsTokenStatsTopUsersInner];

  @override
  final String wireName = r'AnalyticsTokenStatsTopUsersInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsTokenStatsTopUsersInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'userId';
    yield serializers.serialize(
      object.userId,
      specifiedType: const FullType(int),
    );
    yield r'email';
    yield serializers.serialize(
      object.email,
      specifiedType: const FullType(String),
    );
    yield r'totalTokens';
    yield serializers.serialize(
      object.totalTokens,
      specifiedType: const FullType(int),
    );
    yield r'estimatedCostUsd';
    yield serializers.serialize(
      object.estimatedCostUsd,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalyticsTokenStatsTopUsersInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsTokenStatsTopUsersInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.userId = valueDes;
          break;
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.email = valueDes;
          break;
        case r'totalTokens':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalTokens = valueDes;
          break;
        case r'estimatedCostUsd':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.estimatedCostUsd = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalyticsTokenStatsTopUsersInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsTokenStatsTopUsersInnerBuilder();
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

