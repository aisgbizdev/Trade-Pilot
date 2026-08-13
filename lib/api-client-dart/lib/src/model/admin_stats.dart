//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/personal_analytics_top_instruments_inner.dart';
import 'package:trade_pilot_api_client/src/model/admin_stats_mode_breakdown.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'admin_stats.g.dart';

/// AdminStats
///
/// Properties:
/// * [totalUsersToday] 
/// * [totalAnalysesToday] 
/// * [totalAnalysesThisWeek] 
/// * [totalAnalysesThisMonth] 
/// * [totalUsers] 
/// * [instrumentBreakdown] 
/// * [modeBreakdown] 
@BuiltValue()
abstract class AdminStats implements Built<AdminStats, AdminStatsBuilder> {
  @BuiltValueField(wireName: r'totalUsersToday')
  int get totalUsersToday;

  @BuiltValueField(wireName: r'totalAnalysesToday')
  int get totalAnalysesToday;

  @BuiltValueField(wireName: r'totalAnalysesThisWeek')
  int get totalAnalysesThisWeek;

  @BuiltValueField(wireName: r'totalAnalysesThisMonth')
  int get totalAnalysesThisMonth;

  @BuiltValueField(wireName: r'totalUsers')
  int get totalUsers;

  @BuiltValueField(wireName: r'instrumentBreakdown')
  BuiltList<PersonalAnalyticsTopInstrumentsInner> get instrumentBreakdown;

  @BuiltValueField(wireName: r'modeBreakdown')
  AdminStatsModeBreakdown get modeBreakdown;

  AdminStats._();

  factory AdminStats([void updates(AdminStatsBuilder b)]) = _$AdminStats;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AdminStatsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AdminStats> get serializer => _$AdminStatsSerializer();
}

class _$AdminStatsSerializer implements PrimitiveSerializer<AdminStats> {
  @override
  final Iterable<Type> types = const [AdminStats, _$AdminStats];

  @override
  final String wireName = r'AdminStats';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AdminStats object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalUsersToday';
    yield serializers.serialize(
      object.totalUsersToday,
      specifiedType: const FullType(int),
    );
    yield r'totalAnalysesToday';
    yield serializers.serialize(
      object.totalAnalysesToday,
      specifiedType: const FullType(int),
    );
    yield r'totalAnalysesThisWeek';
    yield serializers.serialize(
      object.totalAnalysesThisWeek,
      specifiedType: const FullType(int),
    );
    yield r'totalAnalysesThisMonth';
    yield serializers.serialize(
      object.totalAnalysesThisMonth,
      specifiedType: const FullType(int),
    );
    yield r'totalUsers';
    yield serializers.serialize(
      object.totalUsers,
      specifiedType: const FullType(int),
    );
    yield r'instrumentBreakdown';
    yield serializers.serialize(
      object.instrumentBreakdown,
      specifiedType: const FullType(BuiltList, [FullType(PersonalAnalyticsTopInstrumentsInner)]),
    );
    yield r'modeBreakdown';
    yield serializers.serialize(
      object.modeBreakdown,
      specifiedType: const FullType(AdminStatsModeBreakdown),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AdminStats object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AdminStatsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalUsersToday':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalUsersToday = valueDes;
          break;
        case r'totalAnalysesToday':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalAnalysesToday = valueDes;
          break;
        case r'totalAnalysesThisWeek':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalAnalysesThisWeek = valueDes;
          break;
        case r'totalAnalysesThisMonth':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalAnalysesThisMonth = valueDes;
          break;
        case r'totalUsers':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalUsers = valueDes;
          break;
        case r'instrumentBreakdown':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(PersonalAnalyticsTopInstrumentsInner)]),
          ) as BuiltList<PersonalAnalyticsTopInstrumentsInner>;
          result.instrumentBreakdown.replace(valueDes);
          break;
        case r'modeBreakdown':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AdminStatsModeBreakdown),
          ) as AdminStatsModeBreakdown;
          result.modeBreakdown.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AdminStats deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AdminStatsBuilder();
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

