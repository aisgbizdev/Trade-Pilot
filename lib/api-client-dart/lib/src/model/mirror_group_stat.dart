//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'mirror_group_stat.g.dart';

/// Aggregate stats for one bucket inside a trader-mirror category (session, instrument, time-of-day, etc.).
///
/// Properties:
/// * [key] 
/// * [total] 
/// * [wins] 
/// * [winRate] 
/// * [avgPnlPercent] 
@BuiltValue()
abstract class MirrorGroupStat implements Built<MirrorGroupStat, MirrorGroupStatBuilder> {
  @BuiltValueField(wireName: r'key')
  String get key;

  @BuiltValueField(wireName: r'total')
  int get total;

  @BuiltValueField(wireName: r'wins')
  int get wins;

  @BuiltValueField(wireName: r'winRate')
  num get winRate;

  @BuiltValueField(wireName: r'avgPnlPercent')
  num get avgPnlPercent;

  MirrorGroupStat._();

  factory MirrorGroupStat([void updates(MirrorGroupStatBuilder b)]) = _$MirrorGroupStat;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MirrorGroupStatBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MirrorGroupStat> get serializer => _$MirrorGroupStatSerializer();
}

class _$MirrorGroupStatSerializer implements PrimitiveSerializer<MirrorGroupStat> {
  @override
  final Iterable<Type> types = const [MirrorGroupStat, _$MirrorGroupStat];

  @override
  final String wireName = r'MirrorGroupStat';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MirrorGroupStat object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'key';
    yield serializers.serialize(
      object.key,
      specifiedType: const FullType(String),
    );
    yield r'total';
    yield serializers.serialize(
      object.total,
      specifiedType: const FullType(int),
    );
    yield r'wins';
    yield serializers.serialize(
      object.wins,
      specifiedType: const FullType(int),
    );
    yield r'winRate';
    yield serializers.serialize(
      object.winRate,
      specifiedType: const FullType(num),
    );
    yield r'avgPnlPercent';
    yield serializers.serialize(
      object.avgPnlPercent,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MirrorGroupStat object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MirrorGroupStatBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'key':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.key = valueDes;
          break;
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.total = valueDes;
          break;
        case r'wins':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.wins = valueDes;
          break;
        case r'winRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.winRate = valueDes;
          break;
        case r'avgPnlPercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.avgPnlPercent = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MirrorGroupStat deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MirrorGroupStatBuilder();
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

