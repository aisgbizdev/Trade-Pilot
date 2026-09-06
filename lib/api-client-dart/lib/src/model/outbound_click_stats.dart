//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/outbound_click_stats_by_placement_inner.dart';
import 'package:trade_pilot_api_client/src/model/outbound_click_stats_by_target_inner.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'outbound_click_stats.g.dart';

/// OutboundClickStats
///
/// Properties:
/// * [windowDays] 
/// * [totalAllTime] 
/// * [totalInWindow] 
/// * [byPlacement] 
/// * [byTarget] 
@BuiltValue()
abstract class OutboundClickStats implements Built<OutboundClickStats, OutboundClickStatsBuilder> {
  @BuiltValueField(wireName: r'windowDays')
  int get windowDays;

  @BuiltValueField(wireName: r'totalAllTime')
  int get totalAllTime;

  @BuiltValueField(wireName: r'totalInWindow')
  int get totalInWindow;

  @BuiltValueField(wireName: r'byPlacement')
  BuiltList<OutboundClickStatsByPlacementInner> get byPlacement;

  @BuiltValueField(wireName: r'byTarget')
  BuiltList<OutboundClickStatsByTargetInner> get byTarget;

  OutboundClickStats._();

  factory OutboundClickStats([void updates(OutboundClickStatsBuilder b)]) = _$OutboundClickStats;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(OutboundClickStatsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<OutboundClickStats> get serializer => _$OutboundClickStatsSerializer();
}

class _$OutboundClickStatsSerializer implements PrimitiveSerializer<OutboundClickStats> {
  @override
  final Iterable<Type> types = const [OutboundClickStats, _$OutboundClickStats];

  @override
  final String wireName = r'OutboundClickStats';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    OutboundClickStats object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'windowDays';
    yield serializers.serialize(
      object.windowDays,
      specifiedType: const FullType(int),
    );
    yield r'totalAllTime';
    yield serializers.serialize(
      object.totalAllTime,
      specifiedType: const FullType(int),
    );
    yield r'totalInWindow';
    yield serializers.serialize(
      object.totalInWindow,
      specifiedType: const FullType(int),
    );
    yield r'byPlacement';
    yield serializers.serialize(
      object.byPlacement,
      specifiedType: const FullType(BuiltList, [FullType(OutboundClickStatsByPlacementInner)]),
    );
    yield r'byTarget';
    yield serializers.serialize(
      object.byTarget,
      specifiedType: const FullType(BuiltList, [FullType(OutboundClickStatsByTargetInner)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    OutboundClickStats object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required OutboundClickStatsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'windowDays':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.windowDays = valueDes;
          break;
        case r'totalAllTime':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalAllTime = valueDes;
          break;
        case r'totalInWindow':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalInWindow = valueDes;
          break;
        case r'byPlacement':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(OutboundClickStatsByPlacementInner)]),
          ) as BuiltList<OutboundClickStatsByPlacementInner>;
          result.byPlacement.replace(valueDes);
          break;
        case r'byTarget':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(OutboundClickStatsByTargetInner)]),
          ) as BuiltList<OutboundClickStatsByTargetInner>;
          result.byTarget.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  OutboundClickStats deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = OutboundClickStatsBuilder();
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

