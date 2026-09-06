//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'journal_group_stat.g.dart';

/// Aggregate stats for one instrument or session bucket (best/worst rankings).
///
/// Properties:
/// * [key] 
/// * [winRate] 
/// * [total] 
/// * [avgPnlPercent] 
@BuiltValue()
abstract class JournalGroupStat implements Built<JournalGroupStat, JournalGroupStatBuilder> {
  @BuiltValueField(wireName: r'key')
  String get key;

  @BuiltValueField(wireName: r'winRate')
  num get winRate;

  @BuiltValueField(wireName: r'total')
  int get total;

  @BuiltValueField(wireName: r'avgPnlPercent')
  num? get avgPnlPercent;

  JournalGroupStat._();

  factory JournalGroupStat([void updates(JournalGroupStatBuilder b)]) = _$JournalGroupStat;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(JournalGroupStatBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<JournalGroupStat> get serializer => _$JournalGroupStatSerializer();
}

class _$JournalGroupStatSerializer implements PrimitiveSerializer<JournalGroupStat> {
  @override
  final Iterable<Type> types = const [JournalGroupStat, _$JournalGroupStat];

  @override
  final String wireName = r'JournalGroupStat';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    JournalGroupStat object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'key';
    yield serializers.serialize(
      object.key,
      specifiedType: const FullType(String),
    );
    yield r'winRate';
    yield serializers.serialize(
      object.winRate,
      specifiedType: const FullType(num),
    );
    yield r'total';
    yield serializers.serialize(
      object.total,
      specifiedType: const FullType(int),
    );
    if (object.avgPnlPercent != null) {
      yield r'avgPnlPercent';
      yield serializers.serialize(
        object.avgPnlPercent,
        specifiedType: const FullType(num),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    JournalGroupStat object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required JournalGroupStatBuilder result,
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
        case r'winRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.winRate = valueDes;
          break;
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.total = valueDes;
          break;
        case r'avgPnlPercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
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
  JournalGroupStat deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = JournalGroupStatBuilder();
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

